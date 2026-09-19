import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getFollowUp = async (
  question: string,
  answer: string
): Promise<string> => {
  const response = await fetch("/api/follow-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.followUp) {
    throw new Error(data.error || "Failed to generate follow-up question");
  }

  return data.followUp;
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const file = new File([audioBlob], "recording.webm", { type: "audio/webm" })
  const transcription = await groq.audio.transcriptions.create({
    file: file,
    model: "whisper-large-v3",
  })

  return transcription.text
}
