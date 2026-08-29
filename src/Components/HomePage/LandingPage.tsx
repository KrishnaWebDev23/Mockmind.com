import HeroSection from './HeroSection'
import AIAvatar from './AIAvatar'

type LandingPageProps = {
  onLearnMore: () => void
}

const LandingPage = ({ onLearnMore }: LandingPageProps) => {
  return (
    <>
     {/* Hero Section */}
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row justify-between gap-5 py-10 border-b border-zinc-900">
        <HeroSection onLearnMore={onLearnMore} />
        <AIAvatar />
      </div>
    </>  
  )
}

export default LandingPage
