const express = require('express');
const OpenAI = require('openai');
const { Groq } = require('groq-sdk');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const router = express.Router();

router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024' });
    res.json({ url: response.data[0].url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/generate-video', async (req, res) => {
  // OpenAI Sora (если доступно) или free alternative via HuggingFace
  const { prompt } = req.body;
  // Пример с Replicate (free tier): https://replicate.com (добавь API)
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Token твой_replicate_key`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 'sora-model-version', input: { prompt } })
  });
  const data = await response.json();
  res.json({ url: data.output }); // Видео URL
});

module.exports = router;
// Генерация видео через Sora (только для тех, у кого есть доступ)
router.post('/generate-video-sora', async (req, res) => {
  try {
    const { prompt, duration = 5 } = req.body; // длительность в секундах (4–10 обычно)

    const response = await openai.video.generations.create({
      model: "sora-1.0", // или "sora" — зависит от того, как OpenAI называет в 2025
      prompt: prompt,
      duration: duration,
      size: "1024x576", // стандарт Sora 16:9
      quality: "hd"
    });

    const videoUrl = response.data[0].url;

    res.json({ 
      success: true, 
      url: videoUrl,
      message: "Видео готово за секунды, потому что ты — mitrsht"
    });

  } catch (error) {
    console.error("Sora error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Sora недоступна или квота кончилась" 
    });
  }
});
