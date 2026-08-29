import { create } from 'zustand';

type ResumeData = {
    domain: string;
    skills: string[];
    experienceLevel: string;
    projects: string[];
} | null

type InterviewConfig = {
    jobTitle: string;
    experience: string;
    interviewType: string;
    resumeData: ResumeData;
    timerEnabled: boolean;
}

type InterviewStore = {
    config: InterviewConfig | null;
    setConfig: (config: InterviewConfig) => void;
    clearConfig: () => void;
}

export const useInterviewStore = create<InterviewStore>((set) => ({
   config: {
    jobTitle: "Frontend Developer",
    experience: "Fresher",
    interviewType: "Technical",
    resumeData: null,
    timerEnabled: false
  }, // ← default value — seedha interview page dikhega
    setConfig: (config) => set({config}),
    clearConfig: () => set({config: null}),
}))

