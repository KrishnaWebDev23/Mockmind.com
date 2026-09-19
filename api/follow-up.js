import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, answer } = req.body ?? {};

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Ask exactly one short, relevant follow-up question. Return only the question, with no numbering or explanation.",
        },
        {
          role: "user",
          content: `Original interview question:\n${question}\n\nCandidate's answer:\n${answer}`,
        },
      ],
    });

    const followUp = completion.choices?.[0]?.message?.content
      ?.replace(/[`'";]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!followUp) {
      return res.status(502).json({ error: "Groq returned an empty follow-up" });
    }

    return res.status(200).json({ followUp });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Groq request failed";
    console.error("Failed to generate follow-up:", message);
    return res.status(502).json({ error: "Failed to generate follow-up question" });
  }
}
