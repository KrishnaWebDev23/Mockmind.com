type InterviewEnd = {
  onEndInterview: () => void;
};

const InterviewHeader = ({onEndInterview}:InterviewEnd) => {
  return (
     <header className="border-b border-white/10 bg-[#070707]/95">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
              M
            </div>

            <div>
              <h1 className="text-sm font-semibold">Mockmind AI Interview</h1>

              <p className="text-[10px] text-white/35">
                Technical Interview
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

            <span className="text-[11px] text-white/55">
              Interview in progress
            </span>
          </div>

          {/* End Interview */}
          <button 
            className="rounded-lg cursor-pointer border border-white/10 bg-white/3 px-3 py-3 text-[11px] text-white/55 transition hover:bg-red-500/10 hover:text-red-400"
            type="button"
            aria-label="End interview"
            onClick={onEndInterview}
          >
            End Interview
          </button>
        </div>
            
        {/* Progress */}
        {/* <div className="h-px bg-white/5">
          <div className="h-full w-[42%] bg-white/70" />
        </div> */}
      </header>
  )
}

export default InterviewHeader