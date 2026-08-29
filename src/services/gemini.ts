import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  InterviewConfig,
  InterviewRound,
  IntroRoundType,
} from "../Types/InterviewType";
import { getQuestionPrompt } from '../prompts/getQuestionPrompt';
import { getEvaluatedPrompt } from '../prompts/getEvaluatedPrompt'

type LatestResult = {
  questionId: string;
  question: string;
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",
});

const MOCK_MODE = false; // ← dev mein true, production mein false

// Analyze Resume Function
export const analyzeResume = async (file: File) => {
  if (MOCK_MODE) {
    return {
      isResume: true,
      domain: "Frontend Development",
      skills: ["React", "TypeScript", "Tailwind", "JavaScript"],
      experienceLevel: "Fresher",
      projects: ["MockMind", "Portfolio"],
    };
  }

  // PDF ko base64 mein convert karo
  const base64 = await fileToBase64(file);

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64,
      },
    },
    {
      text: `First, determine whether this document is a resume/CV (a document listing a person's work experience, education, skills, or projects for job applications).

            If it is NOT a resume, respond with only this JSON:
            {
              "isResume": false,
              "domain": "",
              "skills": [],
              "experienceLevel": "",
              "projects": []
            }

            If it IS a resume, analyze it and respond with only this JSON, no extra text:
            {
               "isResume": true,
               "domain": "main domain of the candidate",
               "skills": ["skill1", "skill2"],
               "experienceLevel": "Fresher / Junior / Mid / Senior",
               "projects": ["project1", "project2"]
           }`,
    },
  ]);

  const response = result.response.text();

  // Clean JSON parse karo
  const clean = response.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

// File Converter to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("File reade failed"));
    reader.readAsDataURL(file);
  });
};

// Generate Question Function
export const generateQuestions = async ({
  config,
  latestResult,
}: {
  config: InterviewConfig;
  latestResult: LatestResult[];
}) => {
  if (MOCK_MODE) {
    return {
      valid: true,
      topics: ["HTML", "CSS", "JavaScript", "React"],
      questions: [
        { topic: "HTML", question: "What is semantic HTML?" },
        { topic: "HTML", question: "Difference between div and section?" },
        { topic: "CSS", question: "What is CSS box model?" },
        { topic: "JavaScript", question: "What are closures?" },
        { topic: "React", question: "What are React hooks?" },
      ],
    };
  }

  const recentQuestions = latestResult?.length
    ? latestResult
        .map(
          (item, index) =>
            `${index + 1}. [${item.questionId}] ${item.question}`,
        )
        .join("\n")
    : "No previous interview questions are available.";

  const prompt = getQuestionPrompt({config, recentQuestions})

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 1.0,
    },
  });
  const response = result.response.text();
  const clean = response.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

// Evaluate Interview Function
export const evaluateInterview = async ({
  allRounds,
  introRound,
}: {
  allRounds: InterviewRound[];
  introRound: IntroRoundType;
}) => {
const roundsText = allRounds.map((round, index) => `
  ROUND ${index + 1}

  MAIN QUESTION ID: Q${index + 1}
  Topic: ${round.topic}
  Question: ${round.question}
  Answer: ${round.answer}

  FOLLOW-UP QUESTION ID: FU${index + 1}
  Topic: ${round.topic}
  Question: ${round.followUp}
  Answer: ${round.followUpAnswer}`,).join("\n");

  const IntroRoundText = `
    topic: ${introRound.topic},
    question: ${introRound.question},
    answer: ${introRound.answer},
  `;

  const prompt = getEvaluatedPrompt({roundsText,IntroRoundText})
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const clean = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const evaluation = JSON.parse(clean);

  return evaluation;
};
