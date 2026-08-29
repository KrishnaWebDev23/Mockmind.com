import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserRound, Mail } from 'lucide-react';

const Navbar = () => {
  return (
    <header>
      <motion.nav
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        aria-label="Main-Navigation"
        className="max-w-6xl mx-auto pb-5 flex justify-between items-center gap-4 border-b border-zinc-900"
      >
        {/* Brand */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium tracking-[0.24em] text-zinc-500">
            PREPARE WISE
          </span>

          <span className="mt-3 text-2xl sm:text-3xl md:text-5xl tracking-tight text-white">
            MockMind – Confidence Before the Room
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Register */}
          <Link
            to="/login"
            className="flex items-center gap-1 text-zinc-300 font-medium text-sm hover:text-white transition-colors"
          >
            <UserRound size={16} className="text-white" />

            <span className="hidden sm:inline">
              Register
            </span>
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className="flex items-center gap-1 text-zinc-300 font-medium text-sm hover:text-white transition-colors"
          >
            <Mail size={16} className="text-white" />

            <span className="hidden sm:inline">
              Contact
            </span>
          </Link>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;