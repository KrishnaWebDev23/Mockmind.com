import { TypingEffect } from "../UI/TypingEffect";
import type { InterviewPhase } from "./types";

type InterviewQuestionProps = {
  questionIndex: number;
  totalQuestions: number;
  phase: InterviewPhase;
  question: string;
};


const InterviewQuestion = ({
  questionIndex,
  totalQuestions,
  phase,
  question,
}: InterviewQuestionProps) => {
   const questionNumber =
    questionIndex * 2 +
    (phase === "question" ? 1 : 2);

  const totalQuestionCount =
    totalQuestions * 2;
  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
          Current Question
        </p>

        <span className="rounded-full bg-white/6 px-2.5 py-1 text-[9px] text-white/40">
           Question {questionNumber} / {totalQuestionCount}
        </span>
      </div>

      <h2 className="text-sm font-medium leading-5 text-white/90">
       <TypingEffect text={question} />
      </h2>
    </div>
  );
};

export default InterviewQuestion;
