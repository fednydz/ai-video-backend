import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: '✅ AI Video Backend is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generateText: '/api/generate-text',
      generateAudio: '/api/generate-audio',
      processVideo: '/api/process-video'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import Routes
import textRoutes from './generate-text.js';
import audioRoutes from './generate-audio.js';
import videoRoutes from './process-video.js';

app.use('/api/generate-text', textRoutes);
app.use('/api/generate-audio', audioRoutes);
app.use('/api/process-video', videoRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Export for Vercel
export default app;
