import express from "express";
import multer from "multer";
import Document from "../models/Document.js";
import { auth } from "../middleware/auth.js";
import { extractTextFromPDF } from "../utils/pdf.js";
import { summarizeText, extractClauses, detectRisks } from "../utils/openai.js";

const router = express.Router();

// Multer: memory storage (store PDF in Mongo later)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      cb(new Error("Only PDF files are allowed"));
    else cb(null, true);
  },
});

router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const text = await extractTextFromPDF(req.file.buffer);
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Unable to extract text from PDF" });
    }

    // 1. Save document
    const doc = await Document.create({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      pdfBuffer: req.file.buffer,
      text,
    });

    // 2. Send success response immediately
    res.status(201).json({
      id: doc._id,
      originalFileName: doc.originalFileName,
      createdAt: doc.createdAt,
      ai: { summary: null, clauses: null, risks: null },
      message: "Document uploaded successfully. AI processing in background.",
    });

    // 3. Background AI processing (save each result as it completes)
    (async () => {
      try {
        // 1️⃣ Summary first
        const summary = await summarizeText(text);
        doc.ai = { ...(doc.ai || {}), summary };
        await doc.save();
        console.log("Summary saved");

        // 2️⃣ Risks next
        const risks = await detectRisks(text);
        doc.ai = { ...(doc.ai || {}), risks };
        await doc.save();
        console.log("Risks saved");

        // 3️⃣ Clauses last
        const clauses = await extractClauses(text);
        doc.ai = { ...(doc.ai || {}), clauses };
        await doc.save();
        console.log("Clauses saved");
      } catch (err) {
        console.error("Background AI processing failed:", err);
      }
    })();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
});


// List documents
router.get("/", auth, async (req, res) => {
  const docs = await Document.find({ userId: req.user.id })
    .select("_id originalFileName createdAt ai.summary ai.risks")
    .sort({ createdAt: -1 });
  res.json(
    docs.map((d) => ({
      id: d._id,
      originalFileName: d.originalFileName,
      createdAt: d.createdAt,
      hasSummary: Boolean(d.ai?.summary),
      hasRisks: Boolean(d.ai?.risks),
    }))
  );
});

router.get("/ai/:kind/:id", auth, async (req, res) => {
  const { kind, id } = req.params;

  // Fetch the document
  const doc = await Document.findOne({ _id: id, userId: req.user.id });
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // Only return what's already in DB
  const result = doc.ai?.[kind] || null;
  res.json({ [kind]: result });
});


// Get details for a document (excludes PDF buffer for bandwidth)
router.get("/:id", auth, async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).select("_id originalFileName createdAt text ai qa");
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({
    id: doc._id,
    originalFileName: doc.originalFileName,
    createdAt: doc.createdAt,
    text: doc.text,
    ai: doc.ai || { summary: null, clauses: null, risks: null },
    qa: doc.qa || [],
  });
});

// Delete a document
router.delete("/:id", auth, async (req, res) => {
  const doc = await Document.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
