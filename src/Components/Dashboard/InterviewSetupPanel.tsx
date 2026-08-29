import WelcomeMessage from './WelcomeMessage'
import InterviewSetup from './InterviewSetup'

const InterviewSetupPanel = () => {
  return (
    <div className='flex-1 flex flex-col lg:flex-row items-center lg:justify-center justify-start gap-8 lg:gap-5 px-4 sm:px-6 py-6 lg:py-0 overflow-y-auto lg:overflow-hidden min-w-0'>        
    <WelcomeMessage />
        <div className='w-full max-w-xl min-w-0 flex items-center justify-center'>
          <InterviewSetup />
        </div>
    </div>
  )
}

export default InterviewSetupPanel