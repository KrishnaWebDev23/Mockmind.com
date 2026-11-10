import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voice = "en-GB-RyanNeural" } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }
  if (typeof voice !== "string" || !voice.trim()) {
    return res.status(400).json({ error: "Voice must be a non-empty string" });
  }

  const tts = new MsEdgeTTS();

  try {
    await tts.setMetadata(
      voice,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    );

    const { audioStream } = tts.toStream(
      text.trim().replace(/[<>&'"]/g, (character) => ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character]),
    );

    const closeTts = () => tts.close();
    audioStream.once("close", closeTts);
    audioStream.once("error", (error) => {
      console.error("Failed to generate TTS audio:", error);
      closeTts();
      if (res.headersSent) {
        res.destroy();
      } else {
        res.status(502).json({ error: "Failed to generate speech" });
      }
    });
    res.once("close", () => {
      if (!audioStream.destroyed) audioStream.destroy();
      closeTts();
    });

    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);
  } catch (error) {
    tts.close();
    console.error("Failed to initialize TTS:", error);
    return res.status(502).json({ error: "Failed to generate speech" });
  }
}
