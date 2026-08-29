export const INTERVIEW_MESSAGES = {
  intro:
    "Hello! Welcome to your mock interview session. I'm your AI interviewer today, and I'll be guiding you through a few questions related to your role. Before we dive into the questions, please introduce yourself — your background and experience.",

  introTransition:
    "Thank you for introducing yourself. Let's start with your first question.",

  nextQuestion:
    "Thank you. Here is your next question.",

  complete:
    "Thank you for your time and for answering all the questions. That concludes your interview. Your responses are now being evaluated. Please wait a moment while we prepare your performance.",
} as const;

export const INTRO_ROUND = {
  topic: "Introduction",
  question: "Tell me about yourself",
} as const;