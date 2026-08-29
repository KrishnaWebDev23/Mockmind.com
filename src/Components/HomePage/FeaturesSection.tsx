import {
  BarChart3,
  FileText,
  History,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

type Feature = {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
};

const features: Feature[] = [
  {
    number: "01",
    title: "AI Answer Evaluation",
    description:"Get more than just a score after every answer. Our AI analyzes your communication, technical accuracy, confidence and clarity. Understand what you did well and where your response fell short.Receive actionable feedback designed to help you improve. Turn every practice answer into a learning opportunity.",
    icon: BarChart3,
    tag: "AI ANALYSIS",
  },
  {
    number: "02",
    title: "Resume Based Interview",
    description: "Turn your resume into a personalized interview experience. AI generates relevant questions based on your skills, projects, and experience. Practice answering questions that actually match your professional profile. Experience a more realistic interview tailored specifically to you. Prepare smarter for the questions you’re most likely to face.",
    icon: UserRound,
    tag: "PERSONALIZED",
  },
  {
    number: "03",
    title: "Downloadable PDF Report",
    description: "Get a complete breakdown of your interview performance in one place. Review your scores, strengths, weaknesses, and key areas for improvement. Turn your session results into a clear and easy-to-read report. Download your report as a PDF whenever you need it. Use your insights to build a stronger interview strategy.",
    icon: FileText,
    tag: "REPORT",
  },
  {
    number: "04",
    title: "History & Analytics",
    description: "Keep every interview session organized and easy to revisit. Track your scores, performance, and improvement across multiple interviews. Identify patterns in your strengths and areas that need more practice. Use meaningful analytics to understand your progress over time. See how every practice session brings you closer to interview readiness.",
    icon: History,
    tag: "INSIGHTS",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
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

const visualVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const FeatureVisual = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const Icon = feature.icon;

  return (
    <div className="relative flex min-h-80 w-full items-center justify-center">
      <div className="absolute h-56 w-56 rounded-full bg-cyan-400/5 blur-[90px]" />

      <div className="absolute h-56 w-56 rounded-full border border-white/6" />

      <div className="absolute h-40 w-40 rounded-full border border-white/5" />

      <div className="relative flex h-40 w-40 items-center justify-center rounded-4xl border border-white/10 bg-white/[0.035] shadow-[0_0_60px_rgba(34,211,238,0.07)] backdrop-blur-sm">
        <div className="absolute inset-3 rounded-[1.6rem] border border-white/5" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07]">
          <Icon
            className="h-9 w-9 text-cyan-300"
            strokeWidth={1.2}
          />
        </div>
      </div>

      <div className="absolute left-[10%] top-[20%] rounded-lg border border-white/8 bg-[#080b10]/90 px-3 py-2.5 backdrop-blur-md">
        <div className="mb-1.5 h-1.5 w-12 rounded-full bg-white/10" />
        <div className="h-1.5 w-8 rounded-full bg-cyan-300/50" />
      </div>

      <div className="absolute bottom-[20%] right-[10%] flex items-center gap-2 rounded-lg border border-white/8 bg-[#080b10]/90 px-3 py-2.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />

        <span className="text-[11px] text-zinc-500">
          {index === 0
            ? "Analyzing"
            : index === 1
              ? "Personalized"
              : index === 2
                ? "Generated"
                : "Tracking"}
        </span>
      </div>

      <span className="absolute bottom-[25%] left-[18%] h-1.5 w-1.5 rounded-full bg-cyan-300/50" />

      <span className="absolute right-[20%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/25" />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-cyan-400/2 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-0">

        {/* Compact Header */}
        <motion.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mx-auto max-w-6xl pt-14 text-left sm:pt-16"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUpVariants}
            className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400">
              Powerful Features
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={fadeUpVariants}
            className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]"
          >
            Everything you need to{" "}
            <span className="text-zinc-500">ace your next interview.</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base"
          >
            Practice smarter, get meaningful feedback, and track your progress with
            AI-powered interview tools.
          </motion.p>
        </motion.header>

        {/* Feature Rows */}
        <div className="mt-15">
          {features.map((feature, index) => {
            const reversed = index % 2 !== 0;

            return (
              <div
                key={feature.number}
                className="group border-t border-white/[0.07] py-10 sm:py-14 lg:py-13"
              >
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={containerVariants}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-20 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Description */}
                  <motion.div variants={fadeUpVariants} className="max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-cyan-300/60">
                        {feature.number}
                      </span>

                      <span className="h-px w-8 bg-white/10" />

                      <span className="text-[9px] font-medium tracking-[0.2em] text-zinc-600">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base">
                      {feature.description}
                    </p>
                  </motion.div>

                  {/* Visual */}
                  <motion.div variants={visualVariants}>
                    <FeatureVisual
                      feature={feature}
                      index={index}
                    />
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;