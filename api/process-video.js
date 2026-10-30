import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/process-video
router.post('/', async (req, res) => {
  try {
    const { audio_data, script, style, duration } = req.body;

    if (!audio_data || !script) {
      return res.status(400).json({
        error: 'Missing required fields: audio_data and script'
      });
    }

    // إرسال الطلب إلى سيرفر معالجة الفيديو الخارجي
    const videoProcessorUrl = process.env.VIDEO_PROCESSOR_URL;

    if (!videoProcessorUrl) {
      return res.status(500).json({
        error: 'Video processor URL not configured'
      });
    }

    const response = await axios.post(
      `${videoProcessorUrl}/process`,
      {
        audio: audio_data,
        script: script,
        style: style || 'default',
        duration: duration || 30
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minutes timeout
      }
    );

    res.json({
      success: true,
      data: {
        video_url: response.data.video_url,
        duration: response.data.duration,
        status: response.data.status
      }
    });

  } catch (error) {
    console.error('Video Processing Error:', error);
    res.status(500).json({
      error: 'Failed to process video',
      message: error.message
    });
  }
});

export default router;
