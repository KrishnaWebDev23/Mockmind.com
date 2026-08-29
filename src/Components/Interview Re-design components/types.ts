export type InterviewQuestion = {
  topic: string;
  question: string;
};

export type InterviewPhase =
  | "intro"
  | "question"
  | "followup";

export type InterviewTransition =
  | "intro"
  | "next"
  | "complete"
  | null;

export type PerformanceRound = {
  topic: string;
  question: string;
  answer: string;
  followUp: string;
  followUpAnswer: string;
};

