import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/generate-text
router.post('/', async (req, res) => {
  try {
    const { prompt, topic, style } = req.body;

    if (!prompt && !topic) {
      return res.status(400).json({
        error: 'Missing required field: prompt or topic'
      });
    }

    const systemPrompt = `You are a professional video script writer. 
    Create engaging video scripts in ${style || 'Arabic'}.
    Keep it concise and suitable for short-form video content.`;

    const userPrompt = prompt || `Write a video script about: ${topic}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const generatedText = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        text: generatedText,
        tokens_used: completion.usage.total_tokens
      }
    });

  } catch (error) {
    console.error('Text Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate text',
      message: error.message
    });
  }
});

export default router;
