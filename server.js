import express from 'express';
import cors from 'cors';
import { EdgeTTS } from 'edge-tts-universal';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;

    const tts = new EdgeTTS(text, voice || 'en-US-GuyNeural');
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();
    
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    return res.json({ audio: base64Audio });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('🚀 TTS Backend ready on port 3000'));
