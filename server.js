import express from 'express';
import cors from 'cors';
import { EdgeTTS } from 'edge-tts-universal';
import Groq from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
});

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

app.post('/api/follow-up', async (req, res) => {
  try {
    const { question, answer } = req.body ?? {};

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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

app.listen(3000, () => console.log('🚀 TTS Backend ready on port 3000'));
