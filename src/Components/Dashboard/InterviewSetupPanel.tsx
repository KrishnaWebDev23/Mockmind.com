import WelcomeMessage from './WelcomeMessage'
import InterviewSetup from './InterviewSetup'

const InterviewSetupPanel = () => {
  return (
<div className="flex w-full flex-1 min-w-0 flex-col items-center justify-start gap-8 overflow-x-hidden px-4 py-15 sm:px-6 min-[1250px]:flex-row min-[1250px]:items-center min-[1250px]:justify-center min-[1250px]:gap-8 min-[1250px]:py-10">
      <div className="w-full min-w-0 max-w-2xl flex-1 lg:max-w-2xl">
        <WelcomeMessage />
      </div>

      <div className="w-full max-w-xl min-w-0 shrink-0 lg:max-w-120">
        <InterviewSetup />
      </div>
    </div>
  )
}

export default InterviewSetupPanel
