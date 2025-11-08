import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const BASE_URL = process.env.LIBRE_API_URL || "https://libretranslate.de";

const LANGS = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  gu: "Gujarati",
  ja: "Japanese",
  zh: "Chinese",
  ru: "Russian",
  id: "Indonesian"
};

app.get("/", (req, res) => {
  res.json({
    service: "Jinx Translation API",
    status: "🟢 Running",
    supported_languages: LANGS,
    usage: "POST /translate { text: 'Hello', target: 'hi' }"
  });
});

app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;
    if (!text || !target) {
      return res.status(400).json({ error: "Text and target language required." });
    }

    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target,
        format: "text"
      })
    });

    const data = await response.json();
    res.json({ translated: data.translatedText });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(PORT, () => console.log(`🌐 Jinx Translate running on port ${PORT}`));