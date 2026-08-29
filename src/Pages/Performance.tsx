import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import AssessmentCard from "../Components/Performance/AssessmentCard";
import QuestionBarchart from "../Components/Performance/QuestionsBarchart";
import EmptyState from "../Components/Performance/EmptyState";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../store/useInterviewStore";
import { downloadReport } from "../Components/Performance/downloadReport";
import { motion } from "framer-motion";
import type {
  InterviewResultRow,
  CategoryNames,
} from "../Types/PerformanceType";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const Performance = () => {
  const [evaluatedData, setEvaluatedData] =
    useState<InterviewResultRow | null>(null);

  const [status, setStatus] = useState<
    "loading" | "empty" | "loaded"
  >("loading");

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { clearConfig, config } = useInterviewStore();

  useEffect(() => {
    const getEvaluatedData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("interview_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        setStatus("empty");
        return;
      }

      setEvaluatedData(data);
      setStatus("loaded");
    };

    getEvaluatedData();
  }, [user]);

  const handleInterviewBtn = () => {
    clearConfig();
    navigate("/dashboard");
  };

  const categoryNames: CategoryNames = {
    problemSolving: "Problem Solving",
    confidenceClarity: "Confidence & Clarity",
    technicalKnowledge: "Technical Knowledge",
    communicationSkills: "Communication Skills",
  };

  return (
    <div className="min-h-screen w-full bg-black px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-20 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Loading State */}
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[60vh] items-center justify-center"
          >
            <p className="text-sm text-zinc-400 sm:text-base">
              Loading...
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {status === "empty" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
          >
            <EmptyState />
          </motion.div>
        )}

        {/* Loaded State */}
        {status === "loaded" && evaluatedData && (
          <motion.div
            id="performance-report"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* Header */}
            <motion.header variants={sectionVariants} className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Evaluation Metrics
              </h1>

              {config?.jobTitle && (
                <p className="text-sm text-zinc-400 sm:text-base">
                  {config.jobTitle}
                </p>
              )}
            </motion.header>

            {/* Question Performance */}
            <motion.section
              variants={sectionVariants}
              className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6"
            >
              <QuestionBarchart
                questionScores={
                  evaluatedData.evaluation.questionScores ?? []
                }
              />
            </motion.section>

            {/* Overall Assessment */}
            <motion.section
              variants={sectionVariants}
              className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6"
            >
              <AssessmentCard
                categoryScores={
                  evaluatedData.evaluation.categoryScores
                }
              />
            </motion.section>

            {/* Candidate Skill Assessment */}
            <motion.section variants={sectionVariants} className="w-full">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Candidate Skill Assessment
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {Object.entries(
                  evaluatedData.evaluation.categoryScores
                ).map(([key, categoryData], index) => (
                  <motion.div
                    key={key}
                    variants={cardVariants}
                    className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5"
                  >
                    <div className="flex gap-2 sm:items-center justify-between">
                      <h3 className="min-w-0 wrap-break-word text-sm font-medium leading-6 text-zinc-200 sm:text-base">
                        {index + 1}.{" "}
                        {categoryNames[
                          key as keyof CategoryNames
                        ]}
                      </h3>

                      <span className="w-fit shrink-0 rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                        {categoryData.score}/100
                      </span>
                    </div>

                    <p className="mt-3 wrap-break-word text-sm leading-6 text-zinc-400">
                      {categoryData.feedback}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* Areas of Improvement */}
            <motion.section
              variants={sectionVariants}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6"
            >
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Areas of Improvement
              </h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="mt-4 space-y-3"
              >
                {evaluatedData.evaluation.areasOfImprovement.map(
                  (point, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      className="flex min-w-0 gap-3 rounded-xl bg-zinc-900/60 p-3 sm:p-4"
                    >
                      <span className="shrink-0 text-sm font-semibold text-zinc-500">
                        {index + 1}.
                      </span>

                      <p className="min-w-0 wrap-break-word text-sm leading-6 text-zinc-400">
                        {point}
                      </p>
                    </motion.div>
                  )
                )}
              </motion.div>
            </motion.section>

            {/* Action Buttons */}
            <motion.div
              variants={sectionVariants}
              className="flex flex-col gap-3 pb-6 sm:flex-row sm:justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleInterviewBtn}
                className="cursor-pointer w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 sm:w-auto sm:px-8"
              >
                Start New Interview
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() =>
                  downloadReport("performance-report")
                }
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white sm:w-auto sm:px-8"
              >
                <Download size={16} />
                Download Report
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Performance;