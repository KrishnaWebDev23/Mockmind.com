import { Mic, MicOff } from "lucide-react";
import type { InterviewPhase } from "./types";
import { useEffect, useState } from "react";

type InterviewControlsProps = {
  isRecording: boolean;
  isSubmitDisabled: boolean;
  onMicClick: () => void;
  onSubmit: () => void;
  onEndInterview: () => void;
  phase: InterviewPhase;
  seconds: number;
  timerEnabled: boolean | undefined;
  onComplete?: () => void;
};

const InterviewControls = ({
  isRecording,
  isSubmitDisabled,
  onMicClick,
  onSubmit,
  phase,
  seconds,
  timerEnabled,
  onComplete,
}: InterviewControlsProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const safeSeconds = Math.max(timeLeft, 0);
  const formattedTime = `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (!timerEnabled) return // ← ye add karo ✅

    if (timeLeft <= 0) {
      onComplete?.(); // ← timer khatam
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timeLeft, onComplete, timerEnabled]);

  return (
    <div className="mx-auto flex w-full max-w-155 items-center justify-between gap-3 rounded-2xl border border-white/12 bg-black/20 px-3 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.25)] sm:px-4 sm:py-3 lg:max-w-none lg:rounded-xl">
      {/* TIMER */}
      {timerEnabled && (
        <div className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/2.5 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/6">
            <span className="text-sm opacity-70">⏱</span>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-wider text-white/30">
              Time
            </p>
            <p className="font-mono text-sm font-semibold tracking-wide">
              {formattedTime}
            </p>
          </div>
        </div>
      )}

      {/* MIC */}
      <button
        className={`cursor-pointer flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95 ${timerEnabled ? "h-11 w-11" : "h-12 w-12"} `}
        type="button"
        aria-label="Record answer"
        onClick={onMicClick}
      >
        {isRecording ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      {/* SUBMIT */}
      <button
        className="h-11 min-w-0 flex-1 cursor-pointer rounded-xl border border-white/10 bg-white px-5 text-[11px] font-semibold text-black transition hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
      >
        {phase === "intro" ? "Submit Introduction" : "Next question"}
      </button>
    </div>
  );
};

export default InterviewControls;
