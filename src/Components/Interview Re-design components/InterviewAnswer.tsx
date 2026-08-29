type InterviewAnswerProps = {
  value: string;
  isRecording: boolean;
  isTranscribing: boolean;
  onChange: (value: string) => void;
};

const InterviewAnswer = ({
  value,
  isRecording,
  isTranscribing,
  onChange,
}: InterviewAnswerProps) => {
  return (
    <div className="flex min-h-75 flex-1 flex-col rounded-xl border border-white/10 bg-white/3 p-4 lg:min-h-0">
      <div className="mb-3">
        <p className="text-xs font-medium">Your Answer</p>

        <p className="mt-1 text-[10px] text-white/30">
          {isRecording
            ? "Listening to your answer..."
            : isTranscribing
              ? "Processing your voice..."
              : "Speak naturally or type your answer"}
        </p>
      </div>

      <div className="flex-1 rounded-lg border border-white/[0.07] bg-black/30 overflow-y-hidden">
        {isRecording ? (
          <div className="relative flex min-h-60 h-full flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl sm:h-52 sm:w-52" />

            {/* Listening orb */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
              {/* Outer breathing rings */}
              <div className="absolute inset-0 animate-[ping_2.4s_ease-out_infinite] rounded-full border border-white/8" />
              <div className="absolute inset-2 animate-[ping_2.4s_ease-out_infinite_0.8s] rounded-full border border-white/8 sm:inset-3" />

              {/* Orb */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/6 shadow-[0_0_40px_rgba(255,255,255,0.06)] backdrop-blur-sm sm:h-20 sm:w-20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 sm:h-12 sm:w-12">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-white/80 sm:h-5 sm:w-5"
                  >
                    <path
                      d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M19 11a7 7 0 0 1-14 0M12 18v3M8.5 21h7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="relative mt-4 shrink-0 text-center sm:mt-5">
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50" />
                  <span className="relative inline-flex h-full w-full rounded-full bg-white/70" />
                </span>

                <p className="text-sm font-medium tracking-wide text-white/75">
                  Listening
                </p>
              </div>

              <p className="mt-1 text-[10px] text-white/25">
                Speak naturally — I’m listening
              </p>
            </div>

            {/* Voice waveform */}
            <div className="relative mt-4 flex h-6 shrink-0 items-center justify-center gap-1 sm:mt-5 sm:h-7">
              {[8, 14, 22, 28, 20, 13, 24, 15, 9].map((height, index) => (
                <span
                  key={index}
                  className="w-0.5 rounded-full bg-white/45 animate-bounce"
                  style={{
                    height: `${height}px`,
                    animationDelay: `${index * 90}ms`,
                  }}
                />
              ))}
            </div>

            {/* Recording notice */}
            <div className="relative mt-5 max-w-md shrink-0 sm:mt-6">
              <div className="rounded-md border border-white/6 bg-white/2.5 px-3 py-2">
                <p className="text-[10px] leading-4 text-white/25 sm:text-[10px]">
                  Don't stop recording if your response is not complete. Voice
                  recording can only be attempted once.
                </p>
              </div>
            </div>
          </div>
        ) : isTranscribing ? (
          <div className="flex h-full min-h-60 flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />

            <div className="text-center">
              <p className="text-sm text-white/70">Transcribing...</p>

              <p className="mt-1 text-[10px] text-white/30">
                Turning your voice into text
              </p>
            </div>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing your answer..."
            spellCheck={false}
            autoCorrect="on"
            autoCapitalize="sentences"
            wrap="soft"
            className="h-full min-h-60 w-full resize-none whitespace-pre-wrap rounded-lg bg-transparent p-4 text-xs leading-4 text-white/70 outline-none placeholder:text-white/20 focus:border-white/10 wrap-break-word"
          />
        )}
      </div>
    </div>
  );
};

export default InterviewAnswer;
