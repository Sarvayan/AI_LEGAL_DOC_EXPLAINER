import express from "express";
import Document from "../models/Document.js";
import { auth } from "../middleware/auth.js";
import {
  summarizeText,
  extractClauses,
  detectRisks,
  qaOnDocument,
} from "../utils/openai.js";

const router = express.Router();

const mustOwnDoc = async (userId, docId) => {
  const doc = await Document.findById(docId);
  if (!doc) return null;
  if (doc.userId.toString() !== userId.toString()) return false;
  return doc;
};

router.post("/summarize", auth, async (req, res) => {
  try {
    const { documentId } = req.body;
    const doc = await mustOwnDoc(req.user.id, documentId);
    if (doc === null) return res.status(404).json({ error: "Not found" });
    if (doc === false) return res.status(403).json({ error: "Forbidden" });
    const summary = await summarizeText(doc.text);
    console.log(summaary);
    doc.ai = { ...(doc.ai || {}), summary };
    await doc.save();
    res.json({ summary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

router.post("/clauses", auth, async (req, res) => {
  try {
    const { documentId } = req.body;
    const doc = await mustOwnDoc(req.user.id, documentId);
    if (doc === null) return res.status(404).json({ error: "Not found" });
    if (doc === false) return res.status(403).json({ error: "Forbidden" });
    const clauses = await extractClauses(doc.text);
    console.log(clauses);
    doc.ai = { ...(doc.ai || {}), clauses };
    await doc.save();
    res.json({ clauses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI clause extraction failed" });
  }
});

router.post("/risks", auth, async (req, res) => {
  try {
    const { documentId } = req.body;
    const doc = await mustOwnDoc(req.user.id, documentId);
    if (doc === null) return res.status(404).json({ error: "Not found" });
    if (doc === false) return res.status(403).json({ error: "Forbidden" });
    const risks = await detectRisks(doc.text);
    console.log(risks);
    doc.ai = { ...(doc.ai || {}), risks };
    await doc.save();
    res.json({ risks });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI risk detection failed" });
  }
});

router.post("/qa", auth, async (req, res) => {
  try {
    const { documentId, question } = req.body;
    if (!question || question.trim().length === 0)
      return res.status(400).json({ error: "Question is required" });
    const doc = await mustOwnDoc(req.user.id, documentId);
    if (doc === null) return res.status(404).json({ error: "Not found" });
    if (doc === false) return res.status(403).json({ error: "Forbidden" });
    const { answer, confidence } = await qaOnDocument(doc.text, question);
    // Append to history
    doc.qa = [...(doc.qa || []), { question, answer, confidence }];
    await doc.save();
    res.json({ answer, confidence });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI Q&A failed" });
  }
});

export default router;
