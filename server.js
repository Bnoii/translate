const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// 🌐 Health Check
app.get('/', (req, res) => {
  res.json({
    service: "Jinx Translation API",
    status: "🟢 Running",
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

// 🧠 Translation Endpoint using MyMemory
app.post('/translate', async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target)
    return res.status(400).json({ error: "Missing text or target language." });

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({
      translatedText: data?.responseData?.translatedText || "Translation unavailable.",
      provider: "MyMemory"
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Jinx Translation API running on port ${PORT}`));