import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/generate-audio
router.post('/', async (req, res) => {
  try {
    const { text, voice_id, model_id } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing required field: text'
      });
    }

    // ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id || '21m00Tcm4TlvDq8ikWAM'}`,
      {
        text: text,
        model_id: model_id || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );

    // Convert to base64 for response
    const audioBase64 = Buffer.from(response.data).toString('base64');

    res.json({
      success: true,
      data: {
        audio: audioBase64,
        format: 'mp3',
        duration_estimate: Math.ceil(text.length / 15) // تقريب مدة الصوت
      }
    });

  } catch (error) {
    console.error('Audio Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate audio',
      message: error.message
    });
  }
});

export default router;
