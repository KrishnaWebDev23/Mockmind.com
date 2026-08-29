import photo from "../../assets/robot1.webp"
import { motion } from 'framer-motion'

const AIAvatar = () => {
  return (
    <motion.div 
      className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-lg mx-auto"
      initial={{opacity: 0, scale: 0.8}}
      animate={{opacity:1, scale: 1}}
      transition={{duration: 0.8, delay: 0.4}}
    >
      <img 
        src={photo} 
        alt="robot" 
        className="w-full h-auto object-contain"
      />
    </motion.div>
  )
}

export default AIAvatar