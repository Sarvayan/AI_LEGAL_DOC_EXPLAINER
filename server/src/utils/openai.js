import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-5" || "gpt-5-turbo";

const sanitize = (s) => (s || "").replace(/\u0000/g, ""); // defensive

export const summarizeText = async (text) => {
  const prompt = `Summarize the following legal document into plain English, removing legal jargon but keeping accuracy.\nDocument:\n${text}`;
  const resp = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes legal documents clearly and accurately for non-lawyers.",
      },
      { role: "user", content: prompt },
    ],
  });
  return sanitize(resp.choices[0].message.content);
};

export const extractClauses = async (text) => {
  const prompt = `From the following legal text, extract and list important clauses, obligations, penalties, auto-renewal terms, and unusual clauses.\nDocument:\n${text}`;
  const resp = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You extract key clauses and terms from legal documents.",
      },
      { role: "user", content: prompt },
    ],
  });
  return sanitize(resp.choices[0].message.content);
};

export const detectRisks = async (text) => {
  const prompt = `Highlight any potential risks, red flags, or terms that could disadvantage the user.\nDocument:\n${text}`;
  const resp = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You analyze legal text to identify potential risks and red flags.",
      },
      { role: "user", content: prompt },
    ],
  });
  return sanitize(resp.choices[0].message.content);
};

export const qaOnDocument = async (text, question) => {
  const prompt = `Answer user questions based only on the provided legal document. 
Document:
${text}

Question: ${question}
If unsure, respond: 'I recommend consulting a lawyer for this matter.'

Respond in strict JSON with keys: answer (string) and confidence (0-1 number).`;
  const resp = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "Answer only using the provided document. If you are not sure, say you recommend consulting a lawyer.",
      },
      { role: "user", content: prompt },
    ],
  });
  const content = sanitize(resp.choices[0].message.content || "");
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed.answer === "string") {
      return {
        answer: parsed.answer,
        confidence: Number(parsed.confidence) || null,
      };
    }
  } catch (e) {
    // Fallback: wrap as answer
  }
  // If the model did not return JSON, just return plain text with null confidence
  return { answer: content, confidence: null };
};
