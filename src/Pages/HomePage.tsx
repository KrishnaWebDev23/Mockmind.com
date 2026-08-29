import Navbar from '../Components/UI/Navbar'
import FeaturesSection from '../Components/HomePage/FeaturesSection'
import AboutSection from '../Components/HomePage/AboutSection'
import Footer from '../Components/HomePage/Footer'
import LandingPage from '../Components/HomePage/LandingPage'
import { useRef } from 'react'

const HomePage = () => {
   const aboutRef = useRef<HTMLDivElement>(null)

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className="min-h-screen bg-black py-10 px-5 sm:px-10">
      <Navbar />
      <LandingPage onLearnMore={scrollToAbout} />
      <div ref={aboutRef} >
        <AboutSection />
      </div>
      <FeaturesSection />
      <Footer />
    </div>
  )
}

export default HomePage