import { supabase } from "../lib/supabaseClient";

// Calls the Supabase Edge Function and returns base64 MP3 audio
export const textToSpeech = async (
  text: string,
  voice = "en-GB-RyanNeural"
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("text-to-speech", {
    body: { text, voice },
  });

  if (error) {
    throw new Error(`Edge TTS failed: ${error.message}`);
  }

  if (!data?.audio) {
    throw new Error("No audio returned from Edge TTS");
  }

  return data.audio;
};

// Plays base64 MP3 audio, resolves when playback finishes
export const playMp3Audio = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);

    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("Audio playback failed"));

    audio.play().catch(reject);
  });
};