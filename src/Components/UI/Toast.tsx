import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { motion } from 'framer-motion'
//icon
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toast = () => {
    const {toast, hideToast} = useAuthStore();

    useEffect(() => {
      if(toast.visible) {
        const timer = setTimeout(() => {
           hideToast()
        },4000)
        return () => clearTimeout(timer)
      }
    }, [toast.visible, hideToast])
    

    if(!toast.visible) return null;

    const Icons = {
       success: (
         <span className='flex items-center justify-center w-7 h-7 rounded-full bg-green-500'>
            <FontAwesomeIcon className="text-white text-xs" icon={faCheck} />
         </span>
       ),
       error: (
         <span className='flex items-center justify-center w-7 h-7 rounded-full bg-red-500'>
            <FontAwesomeIcon className="text-white text-xs" icon={faTriangleExclamation} />
         </span>
       ),
       info: (
         <span className='flex items-center justify-center w-7 h-7 rounded-full bg-blue-500'>
            <FontAwesomeIcon className="text-white text-xs" icon={faCircleInfo} />
         </span>
       ),
    }

  return (
    <motion.div 
      className={`fixed flex justify-center items-center gap-3 top-8 right-6 z-50 glass text-white text-sm font-medium px-5 py-3 rounded-lg shadow-lg`}
      initial={{opacity:0, x: 80}}
      animate={{opacity:1, x:0}}
      transition={{duration:0.5, ease: 'easeOut'}}
    >
      {Icons[toast.type]}
      {toast.message}

    </motion.div>
  )
}

export default Toast