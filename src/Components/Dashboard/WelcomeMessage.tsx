import { motion } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  Target,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const tips = [
  {
    icon: Brain,
    title: 'Think before you speak',
    description: 'Take a moment to structure your thoughts.',
  },
  {
    icon: CheckCircle2,
    title: 'Be honest about what you know',
    description: 'Authentic answers make stronger impressions.',
  },
  {
    icon: MessageSquareText,
    title: 'Keep it concise',
    description: 'Make every sentence count.',
  },
  {
    icon: Target,
    title: 'Structure your answers',
    description: 'Stay clear, focused, and easy to follow.',
  },
];

const WelcomeMessage = () => {
  const { user, isNewUser } = useAuthStore();

  const username = user?.username;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative flex w-full max-w-2xl min-w-0 flex-col items-start text-left"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Eyebrow */}
      <motion.div
        variants={itemVariants}
        className="mb-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5"
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />

        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          AI Interview Coach
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="relative max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
      >
        {!username ? (
          'Loading...'
        ) : isNewUser ? (
          <>
            Let&apos;s get you
            <span className="block bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              interview-ready, {username}.
            </span>
          </>
        ) : (
          <>
            Welcome back,{' '}
            <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              {username}.
            </span>
          </>
        )}
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base"
      >
        Practice realistic interview questions, sharpen your answers, and get
        instant AI feedback — so you can walk into your next interview with
        confidence.
      </motion.p>

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        className="my-8 h-px w-full bg-linear-to-r from-white/10 via-white/5 to-transparent"
      />

      {/* Tips heading */}
      <motion.div
        variants={itemVariants}
        className="mb-4 flex items-center gap-2"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          A few things to remember
        </span>
      </motion.div>

      {/* Tips */}
      <motion.div
        variants={containerVariants}
        className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {tips.map((tip) => {
          const Icon = tip.icon;

          return (
            <motion.div
              key={tip.title}
              variants={itemVariants}
              whileHover={{
                y: -3,
                transition: { duration: 0.2 },
              }}
              className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/2.5 p-3.5 transition-colors duration-200 hover:border-white/[0.14] hover:bg-white/5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/8">
                <Icon className="h-4 w-4 text-violet-300 transition-transform duration-200 group-hover:scale-110" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">
                  {tip.title}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                  {tip.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom confidence message */}
      <motion.div
        variants={itemVariants}
        className="mt-7 flex items-center gap-2 text-xs text-zinc-500"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

        <span>Preparation today. Confidence tomorrow.</span>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeMessage;