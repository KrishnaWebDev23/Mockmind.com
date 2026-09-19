import { EdgeTTS } from "edge-tts-universal";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voice } = req.body ?? {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const tts = new EdgeTTS(text, voice || "en-GB-RyanNeural");
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();
    const audio = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({ audio });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TTS request failed";
    return res.status(500).json({ error: message });
  }
}
