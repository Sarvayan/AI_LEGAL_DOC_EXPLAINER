import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  resetPasswordTokenHash: { type: String },
  resetPasswordExpiresAt: { type: Date },
});

export default mongoose.model("User", UserSchema);
