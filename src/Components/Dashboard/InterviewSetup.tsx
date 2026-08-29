import { useForm } from "react-hook-form";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { FileText } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { analyzeResume } from "../../services/gemini";
import { motion, AnimatePresence } from "framer-motion";
import { useInterviewStore } from "../../store/useInterviewStore";
import { useNavigate } from "react-router-dom";
import { usePerformanceStore } from '../../store/usePerformanceStore'

type InterviewSetupForm = {
  jobTitle: string;
  experience: string;
  interviewType: string;
  resume?: File;
  timerEnabled: boolean;
};

type analyzedData = {
  domain: string;
  skills: string[];
  experienceLevel: string;
  projects: string[];
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const InterviewSetup = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeState, setResumeState] = useState<
    "idle" | "analyzing" | "analyzed"
  >("idle");
  const [resumeData, setResumeData] = useState<null | analyzedData>(null);

  const { showToast } = useAuthStore();
  const { setConfig } = useInterviewStore();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, trigger, reset } = useForm<InterviewSetupForm>();
  const { clearPerformanceRound } = usePerformanceStore();

  // Show toast on validation errors

  const onSubmit = (data: InterviewSetupForm) => {
    setConfig({
      jobTitle: data.jobTitle,
      experience: data.experience,
      interviewType: data.interviewType,
      resumeData: resumeData,
      timerEnabled:data.timerEnabled
    });
    clearPerformanceRound();
    navigate('/interview');
  };

  // RHF ka onError callback use karo
  const onError = () => {
    showToast("Please fill all required fields", "error");
  };

  //Drop zone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setValue("resume", file);
      setResumeState("analyzing"); // ← loader dikhao

      try {
        const data = await analyzeResume(file);

        if (!data.isResume) {
          showToast(
            "This doesn't look like a resume. Please upload a valid resume.",
            "error",
          );
          setResumeState("idle");
          setUploadedFile(null);
          setValue("resume", undefined);
          
          return;
        }

        setResumeData(data);
        setResumeState("analyzed"); // ← data dikhao
        setValue("jobTitle", data.domain);
        setValue("experience", data.experienceLevel);
        setValue("interviewType", 'Technical')
        setSelected("Technical");
      } catch {
        showToast("Resume analysis failed", "error");
        setResumeState("idle"); // ← wapas dropzone
      }
    },
    [setValue, showToast],
  );

  //extracting functions and state from useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="flex flex-col px-5 sm:px-8 py-5 sm:py-6 gap-3 rounded-xl w-full max-w-lg glass"
    >
      <h1 className="text-2xl font-normal text-zinc-100">Interview Setup</h1>
      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="show"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-3"
      >
        {/* Job Title */}
        <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
          <label htmlFor="jobTitle" className="text-zinc-300 font-normal">
            Job Title
          </label>
          <input
            type="text"
            className="border border-zinc-500  px-3 py-2 text-white rounded-md"
            id="jobTitle"
            placeholder="Enter your role"
            {...register("jobTitle", {
              required: "Job title is required",
              minLength: {
                value: 2,
                message: "Job title must be at least 2 characters",
              },
            })}
          />
        </motion.div>

        {/* Experience */}
        <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
          <label htmlFor="experience" className="text-zinc-300 font-normal">
            Experience
          </label>
          <input
            type="text"
            className="border border-zinc-500 px-3 py-2 text-white rounded-md"
            id="experience"
            placeholder="e.g. Fresher, 2 years, 5+ years"
            {...register("experience", {
              required: "Experience is required",
            })}
          />
        </motion.div>

        {/* Interview Type dropdown list */}
        <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
          <label htmlFor="interviewType" className="text-zinc-300 font-normal">
            Interview Type
          </label>
          {/* Hidden input for RHF */}
          <input
            type="hidden"
            {...register("interviewType", {
              required: "Please select interview type",
            })}
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="border border-zinc-500 px-3 py-2 rounded-md text-white w-full flex justify-between items-center"
            >
              {selected || "Select Type"}
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" as const }}
                  className="absolute top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md z-10 overflow-hidden"
                >
                  {["Technical", "HR", "Behavioural"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setSelected(item);
                        setValue("interviewType", item);
                        setOpen(false);
                        trigger("interviewType");
                      }}
                      className="px-3 py-2 text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Resume Uploader */}
        <motion.div variants={fieldVariants} className="flex flex-col">
          {/* The code is defined in three state first state idle,analyzing and analyzed to show each one conditionally */}
          <AnimatePresence mode="wait">
            {resumeState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  {...getRootProps()}
                  className={`border border-dashed rounded-md px-4 py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors
                ${isDragActive ? "border-white border-2" : "border-zinc-500 border-2 hover:border-zinc-400"}`}
                >
                  <input {...getInputProps()} />

                  <FileText size={40} className="text-zinc-500" />
                  <p className="text-zinc-400 text-sm font-semibold">
                    Click to upload your resume (optional)
                  </p>
                  <p className="text-zinc-600 text-xs font-medium">PDF only</p>
                </div>
              </motion.div>
            )}

            {resumeState === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-dashed border-zinc-500 border-2 rounded-md px-4 py-8 flex flex-col items-center gap-2"
              >
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                  }}
                  className="text-zinc-400 text-sm"
                >
                  ⏳ Analyzing resume...
                </motion.p>
              </motion.div>
            )}

            {resumeState === "analyzed" && resumeData && (
              <motion.div
                key="analyzed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" as const }}
                className="border border-zinc-700 rounded-md px-4 py-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-zinc-300 text-sm font-semibold">
                    ✅ {uploadedFile?.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeState("idle");
                      setResumeData(null);
                      setUploadedFile(null);
                      setValue("resume", undefined);
                      setSelected("");
                      reset();
                    }}
                    className="text-black text-xs hover:text-zinc-700 border py-1 px-2 rounded-sm bg-white font-semibold cursor-pointer"
                  >
                    Change Resume
                  </button>
                </div>
                <p className="text-zinc-400 text-xs">
                  Domain: {resumeData.domain}
                </p>
                <p className="text-zinc-400 text-xs">
                  Level: {resumeData.experienceLevel}
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Skills: {resumeData.skills.join(", ")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Timer button */}
        <motion.div variants={fieldVariants} className="flex items-center gap-2 py-1" >
            <input 
              type="checkbox"
              id="timerEnabled"
              {...register('timerEnabled')}
              className="w-4 h-4 cursor-pointer accent-white"
            />
            <label htmlFor="timerEnabled" className="text-zinc-300 text-sm cursor-pointer">
               Enable Timer <span className="text-zinc-500 text-xs">( 2 min per question )</span>
            </label>
        </motion.div>

        {/* submit button */}
        <motion.button
          variants={fieldVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-2 bg-white rounded-full py-3 cursor-pointer text-sm font-semibold text-zinc-900"
        >
          Start Interview
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default InterviewSetup;
