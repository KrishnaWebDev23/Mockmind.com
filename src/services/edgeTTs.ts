// Calls the local Node backend instead of the restricted Supabase Edge Function
export const textToSpeech = async (
  text: string,
  voice = "en-GB-RyanNeural"
): Promise<string> => {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Edge TTS failed: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();

  if (!data?.audio) {
    throw new Error("No audio returned from Edge TTS");
  }

  // Returns the exact same base64 data your playMp3Audio function expects!
  return data.audio;
};

// Plays base64 MP3 audio, resolves when playback finishes
// (Kept completely identical so your avatar animations stay perfectly synced!)
export const playMp3Audio = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);

    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("Audio playback failed"));

    audio.play().catch(reject);
  });
};
