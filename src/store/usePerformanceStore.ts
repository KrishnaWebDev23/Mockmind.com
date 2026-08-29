import { create } from 'zustand';

type InterviewRound = {
    topic: string;
    question: string;
    answer: string;
    followUp: string;
    followUpAnswer: string;
}

type PerformanceStore = {
    performanceData: InterviewRound[]
    addPerformanceRound: (data: InterviewRound) => void
    clearPerformanceRound: () => void;
}

export const usePerformanceStore = create<PerformanceStore>((set) => ({
    performanceData: [],
    addPerformanceRound: (newRound) => set((state) => ({
        performanceData: [...state.performanceData, newRound]
    })),
    clearPerformanceRound: () => set({performanceData: []})

}))
    