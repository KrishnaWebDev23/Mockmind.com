import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
});

app.post('/api/tts', async (req, res) => {
  const { text, voice = 'en-GB-RyanNeural' } = req.body ?? {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (typeof voice !== 'string' || !voice.trim()) {
    return res.status(400).json({ error: 'Voice must be a non-empty string' });
  }

  const tts = new MsEdgeTTS();

  try {
    await tts.setMetadata(
      voice,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    );

    const { audioStream } = tts.toStream(
      text.trim().replace(/[<>&'"]/g, (character) => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character]),
    );

    const closeTts = () => tts.close();
    audioStream.once('close', closeTts);
    audioStream.once('error', (error) => {
      console.error('Failed to generate TTS audio:', error);
      closeTts();
      if (res.headersSent) {
        res.destroy();
      } else {
        res.status(502).json({ error: 'Failed to generate speech' });
      }
    });
    res.once('close', () => {
      if (!audioStream.destroyed) audioStream.destroy();
      closeTts();
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
  } catch (error) {
    tts.close();
    console.error('Failed to initialize TTS:', error);
    return res.status(502).json({ error: 'Failed to generate speech' });
  }
});

app.post('/api/follow-up', async (req, res) => {
  try {
    const { question, answer } = req.body ?? {};

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b',
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer. Ask exactly one short, relevant follow-up question. Return only the question, with no numbering or explanation.',
        },
        {
          role: 'user',
          content: `Original interview question:\n${question}\n\nCandidate's answer:\n${answer}`,
        },
      ],
    });

    const followUp = completion.choices?.[0]?.message?.content
      ?.replace(/[`'";]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!followUp) {
      return res.status(502).json({ error: 'Groq returned an empty follow-up' });
    }

    return res.json({ followUp });
  } catch (error) {
    console.error('Failed to generate follow-up:', error);
    return res.status(502).json({ error: 'Failed to generate follow-up question' });
  }
});

app.listen(8000, () => console.log('🚀 API server ready on http://localhost:8000'));
