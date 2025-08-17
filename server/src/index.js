import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- CORS ---
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  // Deployed frontend:
  "https://ai-legal-doc-explainer-frontend1.onrender.com",
  // If you have another client, add it here exactly:
  // "https://ai-legal-doc-explainer-client.onrender.com",
]);

app.use((req, res, next) => {
  // helpful during debugging
  // console.log("Origin:", req.headers.origin, "Path:", req.path, "Method:", req.method);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) like curl/Postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure preflight is handled
app.options("*", cors());

app.use(helmet());
app.use(express.json({ limit: "2mb" }));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api/auth", authLimiter);

// Health check
app.get("/", (_req, res) =>
  res.json({ ok: true, message: "AI Legal Doc Explainer API" })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);

// DB + start
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
