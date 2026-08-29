import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getFollowUp = async (
  question: string,
  answer: string
): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      reasoning_effort: "none",
      max_tokens: 300,

      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Your job is to ask one short, relevant follow-up question based on the candidate's answer.",
        },
        {
          role: "user",
          content: `
Original interview question:
"${question}"

Candidate's answer:
"${answer}"

Instructions:
- Ask exactly ONE follow-up question.
- The follow-up must be relevant to the original question and the candidate's answer.
- Keep it short and natural.
- If the candidate's answer is incorrect or answers a different topic, ask a question that helps clarify the misunderstanding.
- Do not answer the question yourself.
- Do not explain anything.
- Do not include numbering.
- Return ONLY the follow-up question.
          `,
        },
      ],
    });

    const message = completion.choices?.[0]?.message;

   const followUp = (message?.content || "")
  .replace(/[`'";]/g, "")
  .replace(/\s+/g, " ")
  .trim();

    if (!followUp) {
      console.warn("Groq returned an empty follow-up question.");
      return "";
    }

    return followUp;
  } catch (error) {
    console.error("FAILED TO GENERATE FOLLOW-UP:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const file = new File([audioBlob], "recording.webm", { type: "audio/webm" })
  const transcription = await groq.audio.transcriptions.create({
    file: file,
    model: "whisper-large-v3",
  })

  return transcription.text
}
