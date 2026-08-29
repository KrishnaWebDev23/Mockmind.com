import type { RefObject } from "react";
import { InterviewerMessage } from "./InterviewerMessage";
import type { InterviewPhase } from "./types";


type InterviewSidebarProps = {
  message: string | undefined;
  speechPosition: number | undefined;
  speechComplete: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  questionIndex: number;
  totalQuestions: number;
  phase: InterviewPhase;
};

const InterviewSidebar = ({
  videoRef,
  message,
  speechPosition,
  speechComplete,
  questionIndex,
  totalQuestions,
  phase,
}: InterviewSidebarProps) => {

   const questionNumber =
    questionIndex * 2 +
    (phase === "question" ? 1 : 2);

  const totalQuestionCount =
    totalQuestions * 2;

  return (
    <section className="relative h-90 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111] sm:h-107.5 lg:h-full   lg:min-w-0 lg:flex-1">
      {/* <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#252525_0%,#111_45%,#080808_100%)]">
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-white/4 blur-3xl" />

          
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-zinc-700 via-zinc-900 to-black shadow-2xl sm:h-40 sm:w-40">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-black sm:h-12 sm:w-12">
                AI
              </div>

              <p className="text-xs font-medium">AI Interviewer</p>

              <p className="mt-1 text-[10px] text-white/30">Listening</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <video
          ref={videoRef}
          src="/Interviewer2.mp4"
          loop
          muted
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/25" />
      </div>

      {/* Interviewer Status */}
      <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

          <span className="text-[10px] text-white/65 sm:text-[11px]">
            Interviewer
          </span>
        </div>
      </div>

      {/* Question Number */}
      { phase !== "intro" && (
        <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
        <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-black/45 px-3 py-2 shadow-lg">
          <span className="text-[9px] uppercase tracking-wider text-white/35">
            Question
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[11px] font-medium text-white/75">
            {" "}
            {questionNumber}
            <span className="mx-0.5 text-white/25">/</span>
            <span className="text-white/40">{totalQuestionCount}</span>
          </span>
        </div>
      </div>
      )}
      

      {/* AI Question */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <div className="rounded-xl border border-white/10 bg-black/60 p-3 backdrop-blur-xl sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[9px] font-bold text-black">
                AI
              </div>

              <div>
                <p className="text-[12px] font-medium">AI Interviewer</p>
                <p className="text-[10px] text-white/30">Do not refresh page during interview ⚠️</p>
              </div>
            </div>

            {/* Audio */}
            <div className="flex items-center gap-0.75">
              <span className="h-2 w-0.5 animate-pulse bg-white/30" />
              <span className="h-4 w-0.5 animate-pulse bg-white/60" />
              <span className="h-2 w-0.5 animate-pulse bg-white/30" />
              <span className="h-3 w-0.5 animate-pulse bg-white/50" />
            </div>
          </div>

          <div className="rounded-xl px-4 shrink-0">
            <InterviewerMessage
              key={message}
              text={message ?? ""}
              speechPosition={speechPosition}
              speechComplete={speechComplete}
            />
          </div>

          {/* <div className="mt-3 h-0.5 rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-white/60" />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default InterviewSidebar;
