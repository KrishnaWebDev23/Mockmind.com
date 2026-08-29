import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const AboutSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-cyan-400/2 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-0 py-14 sm:py-16">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400">
            About MockMind
          </span>
        </motion.div>

        {/* Two column layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-10"
        >

          {/* Left — Heading */}
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px] leading-tight">
              Built for people who{" "}
              <span className="text-zinc-500">
                take interviews seriously.
              </span>
            </h2>

            <p className="text-sm leading-7 text-zinc-500 sm:text-base">
              MockMind is an AI-powered mock interview platform designed to
              help job seekers, students, and developers prepare for real
              interviews — without the real pressure. Whether you are
              preparing for your first internship or your next big role,
              MockMind gives you a safe space to practice, fail, learn, and
              improve.
            </p>

            {/* Stat row */}
            <motion.div
              variants={containerVariants}
              className="flex items-center gap-8 pt-2"
            >
              <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white">AI</span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-600">Powered</span>
              </motion.div>
              <div className="h-8 w-px bg-white/10" />
              <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white">Real</span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-600">Interview Feel</span>
              </motion.div>
              <div className="h-8 w-px bg-white/10" />
              <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white">Free</span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-600">To Use</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right — Purpose paragraphs */}
          <motion.div variants={containerVariants} className="flex flex-col gap-8">

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 border-t border-white/[0.07] pt-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan-300/60">01</span>
                <span className="h-px w-8 bg-white/10" />
                <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-600">WHY IT EXISTS</span>
              </div>
              <p className="text-sm leading-7 text-zinc-500">
                Most people walk into interviews underprepared — not because
                they lack knowledge, but because they have never practiced
                speaking under pressure. MockMind exists to close that gap.
                It gives you a realistic environment to rehearse your
                answers, build confidence, and get honest feedback before
                the real interview.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 border-t border-white/[0.07] pt-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan-300/60">02</span>
                <span className="h-px w-8 bg-white/10" />
                <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-600">HOW IT HELPS</span>
              </div>
              <p className="text-sm leading-7 text-zinc-500">
                MockMind adapts to you. Upload your resume and it generates
                questions based on your actual skills and experience. Answer
                by typing or speaking, face follow-up questions just like a
                real interviewer would ask, and receive a detailed
                performance report at the end of every session.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 border-t border-white/[0.07] pt-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan-300/60">03</span>
                <span className="h-px w-8 bg-white/10" />
                <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-600">WHO IT IS FOR</span>
              </div>
              <p className="text-sm leading-7 text-zinc-500">
                MockMind is built for anyone preparing for a job interview —
                fresh graduates, career switchers, or experienced developers
                brushing up before a big opportunity. If you want to walk
                into your next interview feeling ready, MockMind is for you.
              </p>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;