export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, answer } = req.body ?? {};

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY in Vercel environment variables");
      return res.status(500).json({ error: "Groq is not configured on the server" });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    const result = await groqResponse.json().catch(() => ({}));

    if (!groqResponse.ok) {
      console.error("Groq API error:", groqResponse.status, result?.error?.message);
      return res.status(502).json({ error: "Groq request failed" });
    }

    const followUp = result.choices?.[0]?.message?.content
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
