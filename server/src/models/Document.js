import mongoose from 'mongoose';

const QASchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  confidence: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  originalFileName: { type: String, required: true },
  contentType: { type: String, default: 'application/pdf' },
  size: { type: Number, default: 0 },
  pdfBuffer: { type: Buffer, required: true },
  text: { type: String, required: true },
  ai: {
    summary: { type: String },
    clauses: { type: String },
    risks: { type: String }
  },
  qa: { type: [QASchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', DocumentSchema);
