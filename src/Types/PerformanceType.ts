type CategoryScore = {
  score: number;
  feedback: string;
};

type QuestionScores = {
  score: number;
  topic: string;
  question: string;
};

type EvaluatedData = {
  categoryScores: {
    problemSolving: CategoryScore;
    confidenceClarity: CategoryScore;
    technicalKnowledge: CategoryScore;
    communicationSkills: CategoryScore;
  };
  questionScores: QuestionScores[];
  areasOfImprovement: string[];
};

export type InterviewResultRow = {
  id: string;
  user_id: string;
  evaluation: EvaluatedData;
  created_at: string;
};

export type CategoryNames = {
  problemSolving: string;
  confidenceClarity: string;
  technicalKnowledge: string;
  communicationSkills: string;
};