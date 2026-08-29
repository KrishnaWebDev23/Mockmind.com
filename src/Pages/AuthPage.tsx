import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
// Framer motion
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from '../Components/Auth/LoginForm'
import RegisterForm from '../Components/Auth/RegisterForm'
// Icon
import { X } from "lucide-react" 

const Login = () => {
  const [loginFlag,setLoginFlag] = useState<boolean>(false)
  const navigate = useNavigate()
  return (
    <div className="relative flex flex-col gap-6 min-h-screen bg-black px-5 py-6 md:px-10">
        {/* Naviagte button */}
        <button 
          className='absolute text-zinc-300 cursor-pointer top-5 right-5 md:right-10 glass py-3 px-4 sm:px-6 rounded'
          onClick={() => navigate('/')}
        > 
          <X size={20} className="text-white " /> 
        </button>
        {/* Login and Register Navigation buttons */}
        <div className='flex flex-col gap-5 mx-auto w-full max-w-lg'>
          {/* Header */}
          <div>
            <h1 className="text-white text-3xl md:text-5xl">MockMind!</h1>
            <p className='text-zinc-400 text-sm mt-2' >New user? Create an account to get started</p>
          </div>

          <div className='flex gap-5 border-b border-zinc-800'>
            {/* Sign in */}
             <button 
               onClick={() => setLoginFlag(false)} 
               className={` text-zinc-300 text-sm font-semibold pb-4 cursor-pointer ${loginFlag ? 'border-transparent' : 'border-zinc-300' } border-b-2 `}
              >Register</button>
              {/* Register  */}
             <button 
              onClick={() => setLoginFlag(true)} 
              className={` text-sm font-semibold pb-4 cursor-pointer border-b-2 ${loginFlag ? 'border-zinc-300 text-zinc-300' : 'border-transparent text-zinc-500'} `}
            >Sign in</button>
          </div>
        </div>
      {/* Sign in and Register Components with Framer motion */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={loginFlag ? 'register' : 'login'}
          initial={{opacity:0, y: 25}}
          animate={{opacity:1, y: 0}}
          exit={{opacity:0, y:-25}}
          transition={{duration: 0.6}}
        >
           {loginFlag ? <LoginForm /> : <RegisterForm />}
        </motion.div>
      </AnimatePresence>

</div>
  )
}

export default Login