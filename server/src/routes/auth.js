import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { isValidEmail, isStrongPassword } from "../utils/validators.js";
import { CONFIG } from "../config.js";
import { sendPasswordResetEmail } from "../utils/email.js";

const router = express.Router();

const signToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, "mySuperSecretKey123", {
    expiresIn: CONFIG.jwtExpiresIn,
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email format" });
    if (!isStrongPassword(password))
      return res
        .status(400)
        .json({
          error:
            "Password must be 8+ chars with upper, lower, number, and special char",
        });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether email exists
      return res.json({ ok: true });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = expires;
    await user.save();
    const base = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    const resetUrl = `${base}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`;
    await sendPasswordResetEmail({ to: email, resetUrl });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!isStrongPassword(newPassword))
      return res.status(400).json({ error: "Weak password" });
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    if (user.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.resetPasswordTokenHash) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
