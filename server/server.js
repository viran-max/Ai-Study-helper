const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY is not set. The AI endpoint will not work until it is configured.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({ message: "AI Study Helper Backend is running!" });
});

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question } = req.body || {};

    if (typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ error: "Question is required." });
    }

    if (question.length > 4000) {
      return res.status(413).json({ error: "Question is too long. Please keep it under 4000 characters." });
    }

    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      system_instruction: `
You are an AI Study Helper for college students.
Explain technical and academic concepts in simple language.
Use examples when helpful and break difficult ideas into smaller steps.
Prefer practical explanations over unnecessary theory.
For programming concepts, include simple code examples when useful.
If a student seems confused, use an easier analogy.
Keep answers organized with headings, bullet points, and examples.
Avoid making answers unnecessarily complicated.
`,
      input: question.trim(),
    });

    return res.json({ answer: response.output_text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Something went wrong while asking the AI service. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
