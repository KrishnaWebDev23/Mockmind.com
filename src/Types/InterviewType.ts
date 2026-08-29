// types/interview.ts
export type ResumeData = {
    domain: string;
    skills: string[];
    experienceLevel: string;
    projects: string[];
} | null

export type InterviewConfig = {
    jobTitle: string;
    experience: string;
    interviewType: string;
    resumeData: ResumeData;
    timerEnabled: boolean;
}

export type InterviewRound = {
    topic: string;
    question: string;
    answer: string;
    followUp: string;
    followUpAnswer: string;
    answerAudio?: Blob;
    followUpAudio?: Blob;
}


type SpeechRecognitionResult = {
  transcript: string;
};

export type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResult;
    };
    length: number;
  };
};

export type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
};

export type IntroRoundType = {
  topic: string,
  question: string,
  answer: string,
}