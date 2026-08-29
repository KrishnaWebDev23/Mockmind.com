//Hero section page
import Button from "../UI/Button";
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type LandingPageProps = {
  onLearnMore: () => void
}

const HeroSection = ({ onLearnMore }: LandingPageProps) => {
  return (
    <div>
      {/* Paragraph with Framer motion */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.4}}
      >
        <p className="text-lg leading-8 md:text-xl text-zinc-400 font-light">
          Practice real interview questions tailored to your role and
          experience. Answer by typing or voice, whichever feels natural to
          you. Get instant AI feedback on every answer you give. Track your
          progress and improve with every session.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div 
       className="flex gap-5 mt-10"
       initial={{opacity: 0, y: 20}}
       animate={{opacity: 1, y: 0}}
       transition={{duration: 0.5, delay: 0.5}} 
      >
        <Link to={'/login'} >
            <Button text={"Start your session"} />
        </Link>
        <button 
          className="cursor-pointer border px-3 rounded-lg text-gray-500"
          onClick={onLearnMore}
        >
          Learn more
        </button>
      </motion.div>

      {/* Cards */}
      <dl className="mt-12 flex gap-5 flex-wrap sm:flex-nowrap">
        {/* Card 1 */}
        <motion.div 
          className="w-full h-25  p-4 rounded-xl lg:w-40 glass"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.7}}
        >
          <dt className="text-zinc-500 text-sm">Frontend</dt>
          <dd className="mt-2 text-white text-lg">React.js</dd>
        </motion.div>
        {/* Card 2 */}
        <motion.div 
          className="w-full h-25 border p-4 rounded-xl lg:w-40 glass"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 1.1}}
        >
          <dt className="text-zinc-500 text-sm">Backend</dt>
          <dd className="mt-2 text-white text-lg">Supabase</dd>
        </motion.div>
        {/* Card 3 */}
        <motion.div 
          className="w-full h-25 border p-4 rounded-xl lg:w-40 glass"
           initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 1.5}}
        >
          <dt className="text-zinc-500 text-sm">AI engine</dt>
          <dd className="mt-2 text-white text-lg">Gemini & Groq</dd>
        </motion.div>
      </dl>
    </div>
  );
};

export default HeroSection;
