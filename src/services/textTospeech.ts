import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MOCK_MODE = false;

// Generates audio from Gemini TTS and returns base64 raw PCM data
export const textToSpeech = async (textToSpeak: string): Promise<string> => {
  if (MOCK_MODE) return "";

  const ttsModel = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-tts-preview",
  });

  const requestConfig = {
    contents: [{ role: "user", parts: [{ text: textToSpeak }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Kore",
          },
        },
      },
    },
  } as Parameters<typeof ttsModel.generateContent>[0];

  const result = await ttsModel.generateContent(requestConfig);
  const audioBase64 =
    result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioBase64) {
    throw new Error("Failed to generate audio stream from Gemini.");
  }

  return audioBase64;
};

// Decodes base64 raw PCM (16-bit, mono, 24kHz) and plays it via Web Audio API.
// Returns a promise that resolves when playback finishes — use this to sync
// with your avatar video (pause/reset on resolve).
export const playPcmAudio = async (
  base64Data: string,
  sampleRate = 24000
): Promise<void> => {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768;
  }

  const audioCtx = new AudioContext();
  const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
  audioBuffer.copyToChannel(float32, 0);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();

  return new Promise((resolve) => {
    source.onended = () => {
      audioCtx.close();
      resolve();
    };
  });
};

// Convenience wrapper — call this one function from your component
export const speakText = async (text: string): Promise<void> => {
  const audioBase64 = await textToSpeech(text);
  if (!audioBase64) return; // MOCK_MODE case
  await playPcmAudio(audioBase64);
};