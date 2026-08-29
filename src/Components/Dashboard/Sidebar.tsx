import { LayoutDashboard, FileText, ChartColumnIncreasing, Settings, X, LogOut, Menu } from 'lucide-react'
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore'
import { supabase } from '../../lib/supabaseClient'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const Sidebar = () => {
    const location = useLocation();
    const [active, setActive] = useState<string>(location.pathname);
    const [isOpen, setIsOpen] = useState(false);
    const { user, clearUser } = useAuthStore();
    
    const navigate = useNavigate();
    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, nav: '/dashboard' },
        { label: 'Performance', icon: FileText, nav: '/performance' },
        { label: 'Resume Analyzer', icon: ChartColumnIncreasing, nav: ''},
        { label: 'Settings', icon: Settings, nav: ''},
    ]
    
    const handleSignOut = async () => {
       await supabase.auth.signOut();
       clearUser();
       navigate('/');
    }

  return (
    <>
      {/* Mobile hamburger — only visible when drawer is closed, on small screens */}
      <button
        onClick={() => setIsOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-30 text-white bg-black border border-white/20 rounded-lg p-2'
      >
        <Menu size={22} />
      </button>
      
      {/* Sidebar for small devices */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — only on mobile when drawer is open */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className='lg:hidden fixed inset-0 bg-black/60 z-40'
            />

            {/* Sidebar itself — mobile drawer, animated */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className='w-72 sm:w-80 h-screen flex flex-col border-r border-white/20 bg-black fixed top-0 left-0 z-50 lg:hidden'
            >
              {/* Sidebar Logo */}
              <div className='flex justify-between items-center border-b border-white/20 px-5 py-4'>
                 <h1 className="text-xl font-medium text-white">MockMind</h1>
                 <X
                   onClick={() => setIsOpen(false)}
                   className='text-white cursor-pointer'
                   size={28}
                   strokeWidth={1}
                 />
              </div>
              {/* Sidebar Nav */}
              <motion.div
                variants={navContainerVariants}
                initial="hidden"
                animate="show"
                className='flex flex-col gap-2 py-6 px-5 border-b border-white/20'
              >
                 {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.button
                        key={item.label}
                        variants={navItemVariants}
                        onClick={() => {
                          setActive(item.nav);
                          setIsOpen(false);
                          navigate(item.nav)
                        }}
                        className={`flex items-center gap-3 px-5 py-2 rounded-lg cursor-pointer
                          ${active === item.nav
                             ? 'bg-white text-black font-medium'
                             : 'text-zinc-300'
                          }`}
                      >
                         <Icon size={20} />
                         {item.label}
                      </motion.button>
                    )
                 })
                 }
              </motion.div>

              {/* Logout */}
              <div className='mt-auto text-white flex justify-between items-center px-5 py-3 border-t border-white/20'>
                 <div className='flex items-center gap-2 min-w-0'>
                    <span className='shrink-0 bg-white text-black font-medium text-lg rounded-full w-10 h-10 flex items-center justify-center'>
                      {!user?.username ? '...' : user?.username?.[0].toUpperCase()}
                    </span>
                    <span className='text-sm truncate'>
                      {!user?.username ? 'loading...' : user?.username}
                    </span>
                 </div>
                 <div
                   className='flex items-center gap-2 cursor-pointer shrink-0'
                   onClick={handleSignOut}
                  >
                    <LogOut size={20} />
                    <span className='text-sm hidden sm:inline'>Sign out</span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar itself — desktop, always visible, no animation needed */}
      <div className='hidden bg-black lg:flex w-76 h-screen flex-col border-r border-white/20'>
          {/* Sidebar Logo */}
          <div className='flex justify-between items-center border-b border-white/20 px-5 py-4'>
             <h1 className="text-xl font-medium text-white">MockMind</h1>
          </div>
          {/* Sidebar Nav Items */}
          <div className='flex flex-col gap-2 py-10 px-5 border-b border-white/20'>
             {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActive(item.nav)
                      navigate(item.nav)
                    }}
                    className={`flex items-center gap-3 px-5 py-2 rounded-lg cursor-pointer
                      ${active === item.nav
                         ? 'bg-white text-black font-medium'
                         : 'text-zinc-300'
                      }`}
                  >
                     <Icon size={20} />
                     {item.label}
                  </button>
                )
             })
             }
          </div>
          {/* Logout */}
          <div className='mt-auto text-white flex justify-between items-center px-5 py-3 border-t border-white/20'>
             <div className='flex items-center gap-2 min-w-0'>
                <span className='shrink-0 bg-white text-black font-medium text-lg rounded-full w-10 h-10 flex items-center justify-center'>
                  {!user?.username ? '...' : user?.username?.[0].toUpperCase()}
                </span>
                <span className='text-sm truncate'>
                  {!user?.username ? 'loading...' : user?.username}
                </span>
             </div>
             <div
               className='flex items-center gap-2 cursor-pointer shrink-0'
               onClick={handleSignOut}
              >
                <LogOut size={20} />
                <span className='text-sm'>Sign out</span>
             </div>
          </div>
      </div>
    </>
  )
}

export default Sidebar