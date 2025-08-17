import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import aiRoutes from "./routes/ai.js";
import path from "path";

dotenv.config({ path: path.resolve("../.env") });

const app = express();
const PORT = 8080 || 5000;

const allowedOrigin = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: "2mb" }));

// Basic rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api/auth", authLimiter);

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
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
