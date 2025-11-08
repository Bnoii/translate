import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MYMEMORY_API = process.env.MYMEMORY_API || "https://api.mymemory.translated.net/get";
const DEFAULT_LANG = process.env.DEFAULT_LANG || "en";

app.get("/", (req, res) => {
  res.json({
    service: "Jinx Translation API",
    status: "🟢 Running",
    powered_by: "MyMemory",
    supported_languages: {
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
    },
    usage: "POST /translate { text: 'Hello', target: 'hi' }"
  });
});

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Please provide both 'text' and 'target' language." });
  }

  try {
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data?.responseData?.translatedText) {
      res.json({
        success: true,
        original: text,
        translated: data.responseData.translatedText,
        target: target
      });
    } else {
      res.status(500).json({ error: "Translation failed or unsupported language." });
    }
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🌍 Jinx Translation API running on port ${PORT}`);
});