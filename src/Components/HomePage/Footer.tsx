import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-0 pt-13 my-10 border-t border-zinc-900"
      >

        <div className="flex flex-col lg:flex-row justify-between gap-10">

          {/* Brand */}
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-3 max-w-sm">
            <span className="text-sm font-medium tracking-[0.24em] text-zinc-500">
              PREPARE WISE
            </span>
            <span className="text-2xl tracking-tight text-white">
              MockMind
            </span>
            <p className="text-sm leading-6 text-zinc-600">
              An AI-powered mock interview platform designed to help you 
              practice, improve, and walk into your next interview with confidence.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-10">

            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Product
              </span>
              <div className="flex flex-col gap-3">
                <Link to="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Get Started
                </Link>
                <Link to="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Built With
              </span>
              <div className="flex flex-col gap-3">
                <span className="text-sm text-zinc-500">React + TypeScript</span>
                <span className="text-sm text-zinc-500">Gemini 2.5 Flash</span>
                <span className="text-sm text-zinc-500">Groq + LLaMA</span>
                <span className="text-sm text-zinc-500">Supabase</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUpVariants}
          className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <span className="text-xs text-zinc-700">
            © {new Date().getFullYear()} MockMind. Built by Kartik.
          </span>
          <span className="text-xs text-zinc-700">
            Confidence Before the Room.
          </span>
        </motion.div>

      </motion.div>
    </footer>
  )
}

export default Footer