import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (
    "smtp.gmail.com" &&
    "587" &&
    "vkaura1010@gmail.com" &&
    "lfubrcbfxyvsgdic"
  ) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: Number("587"),
      secure: false,
      auth: { user: "vkaura1010@gmail.com", pass: "lfubrcbfxyvsgdic" },
    });
  }
  return transporter;
};

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const from = process.env.EMAIL_FROM || "no-reply@example.com";
  const t = getTransporter();
  const subject = "Reset your password - AI Legal Doc Explainer";
  const html = `<p>You requested a password reset.</p>
  <p>Click the link below to reset your password:</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>
  <p>If you did not request this, you can ignore this email.</p>`;

  if (!t) {
    console.log("SMTP not configured. Password reset URL:");
    console.log(resetUrl);
    return;
  }
  await t.sendMail({ from, to, subject, html });
};
