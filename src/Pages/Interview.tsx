// My older version of interview.tsx code
// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Mic, MicOff, X, TriangleAlert } from "lucide-react";
// import { useInterviewStore } from "../store/useInterviewStore";
// import { useAuthStore } from "../store/useAuthStore";
// import CircularTimer from "../Components/Interview/CircularTimer";
// import { generateQuestions } from "../services/gemini";
// import { getFollowUp } from "../services/groq";
// import InterviewNavigationGuard from "../Components/Interview/InterviewNavigationGuard";
// import InterviewReloadGuard from "../Components/Interview/InterviewReloadGuard";
// import { usePerformanceStore } from "../store/usePerformanceStore";
// import { evaluateInterview } from "../services/gemini";
// import { supabase } from "../lib/supabaseClient";
// import { transcribeAudio } from "../services/groq";
// import type {
//   SpeechRecognitionInstance,
//   SpeechRecognitionEvent,
// } from "../Types/InterviewType";
// import FailedUI from "../Components/Interview/FailedUI";
// import { TypingEffect } from "../Components/UI/TypingEffect";
// import { InterviewerMessage } from "../Components/Interview/InterviewerMessage";

// type Question = {
//   topic: string;
//   question: string;
// };

// const Interview = () => {
//   const navigate = useNavigate();
//   const { showToast, user } = useAuthStore();
//   const { config, clearConfig } = useInterviewStore();
//   const { addPerformanceRound, performanceData } = usePerformanceStore();
//   const [answer, setAnswer] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [questionsFetched, setQuestionsFetched] = useState(false);
//   const [questionIndex, setQuestionIndex] = useState<number>(0);
//   const [phase, setPhase] = useState<"intro" | "question" | "followup">("intro");
//   const [followUp, setFollowUp] = useState<string>("");
//   const [followUpAnswer, setFollowUpAnswer] = useState<string>("");
//   const [disFlag, setDisFlag] = useState<boolean>(false);
//   const [isEvaluating, setIsEvaluating] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null,);
//   const [transcribedAnswer, setTranscribedAnswer] = useState("");
//   const [transcribedFollowUpAnswer, setTranscribedFollowUpAnswer] = useState("");
//   const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
//   const finalAnswer = transcribedAnswer.trim() ? transcribedAnswer : answer;
//   const finalFollowUpAnswer = transcribedFollowUpAnswer.trim() ? transcribedFollowUpAnswer : followUpAnswer;
//   const [questionsError, setQuestionsError] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
//   const [introAnswer, setIntroAnswer] = useState("");
//   const [speechPosition, setSpeechPosition] = useState<number | undefined>(undefined);
//   const [transition, setTransition] = useState<"intro" | "complete" | null>(null);
//   const [speechComplete, setSpeechComplete] = useState(false);
//   const IntroPrompt = "Hello! Welcome to your mock interview session. I'm your AI interviewer today, and I'll be guiding you through a few questions related to your role. Before we dive into the questions, please introduce yourself — your background and experience.";
//   const IntroTransitionMessage = "Thank you for introducing yourself. Let's start with your first question.";
//   const CompleteMessage = "Thank you for your time and for answering all the questions. That concludes your interview. Your responses are now being evaluated. Please wait a moment while we prepare your performance.";
//  const currentSpokenText =
//   transition === "intro"
//     ? IntroTransitionMessage
//     : transition === "complete"
//       ? CompleteMessage
//       : phase === "intro"
//         ? IntroPrompt
//         : phase === "question"
//           ? questions[questionIndex]?.question
//           : followUp;

//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = window.speechSynthesis.getVoices();

//       console.log("Available voices:", availableVoices);

//       // Prefer voices commonly identified as male
//       const maleVoice = availableVoices.find((voice) => {
//         const name = voice.name.toLowerCase();

//         return (
//           name.includes("male") ||
//           name.includes("david") ||
//           name.includes("mark") ||
//           name.includes("alex") ||
//           name.includes("daniel")
//         );
//       });

//       selectedVoiceRef.current = maleVoice ?? availableVoices[0] ?? null;

//       console.log("Selected voice:", selectedVoiceRef.current);
//     };

//     loadVoices();

//     window.speechSynthesis.addEventListener(
//       "voiceschanged",
//       loadVoices
//     );

//     return () => {
//       window.speechSynthesis.removeEventListener(
//         "voiceschanged",
//         loadVoices
//       );

//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   // Converts the given text into speech and synchronizes the video playback with the speech.
// const speak = (text: string) => {
//   if (!text) return;

//   window.speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance(text);

//   if (selectedVoiceRef.current) {
//     utterance.voice = selectedVoiceRef.current;
//   }

//   utterance.rate = 1;
//   utterance.pitch = 1;
//   utterance.lang = "en-US";

//   utterance.onstart = () => {
//     setSpeechPosition(0);
//     setSpeechComplete(false);

//     videoRef.current?.play();
//   };

//   utterance.onboundary = (event) => {
//     if (typeof event.charIndex === "number") {
//       setSpeechPosition(event.charIndex);
//     }
//   };

//   utterance.onend = () => {
//     setSpeechComplete(true);

//     videoRef.current?.pause();

//     if (videoRef.current) {
//       videoRef.current.currentTime = 0;
//     }

//    if (text === IntroTransitionMessage) {
//   setTransition(null);
// }
//   };

//   window.speechSynthesis.speak(utterance);
// };

//   // Fetches interview questions based on the current configuration and handles loading, validation, and API errors.
//   useEffect(() => {
//     if (!config) {
//       showToast("Please fill the form", "info");
//       navigate("/dashboard");
//       return;
//     }

//     if (questionsFetched) return;

//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         setQuestionsError(false);
//         // throw new Error("TEST API FAILURE");
//         const data = await generateQuestions(config!);

//         if (!data.valid) {
//           showToast(data.reason, "error");
//           setQuestionsError(true);
//           return;
//         }

//         setQuestions(data.questions);
//         setQuestionsFetched(true);
//       } catch (error) {
//         console.error("Failed to generate interview questions:", error);
//         setQuestionsError(true);
//         showToast("Failed to generate questions", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [config, navigate, showToast, questionsFetched]);

//   const currentQuestion = questions[questionIndex]?.question;

// useEffect(() => {
//   if (transition === "intro") {
//     speak(IntroTransitionMessage);
//     return;
//   }

//   if (transition === "complete") {
//     speak(CompleteMessage);
//     return;
//   }

//   if (phase === "intro") {
//     speak(IntroPrompt);
//     return;
//   }

//   if (phase === "question" && currentQuestion) {
//     speak(currentQuestion);
//     return;
//   }

//   if (phase === "followup" && followUp) {
//     speak(followUp);
//   }
// }, [
//   transition,
//   phase,
//   currentQuestion,
//   followUp,
// ]);

//   // Resets the question-fetching state to retry generating questions.
//   const handleRetry = () => {
//     setQuestionsError(false);
//     setQuestionsFetched(false);
//     setLoading(true);
//   };

//   // Displays the retry screen when question generation fails.
//   if (questionsError) {
//     return <FailedUI onRetry={handleRetry} />;
//   }

//   // Displays the retry screen when no interview questions are available.
//   if (!questions.length) {
//     return <FailedUI onRetry={handleRetry} />;
//   }

//   // Displays a loading screen while the interview questions are being prepared.
//   if (loading) {
//     return (
//       <div className="bg-black h-screen flex justify-center items-center">
//         <p className="text-zinc-400">Preparing your interview...</p>
//       </div>
//     );
//   }

//   // Validates the user's answer, manages the interview flow, handles follow-ups, and evaluates the interview when completed.
//   const handleSubmit = async () => {
//     const currentAnswer = phase === "intro" ? introAnswer : phase === "question" ? answer : followUpAnswer;

//     if (!currentAnswer.trim()) {
//       showToast("Answer cannot be empty", "error");
//       return;
//     }

//     if (currentAnswer.trim().length < 20) {
//       showToast("Answer is too short, please elaborate", "error");
//       return;
//     }

//     setDisFlag(true); // turant disable — validation pass hote hi

//    if (phase === "intro") {
//   setPhase("question");
//   setTransition("intro");
//   setDisFlag(false);
//   return;
// }

//     if (phase === "question") {
//       const followUpQuestion = await getFollowUp(
//         questions[questionIndex].question,
//         answer,
//       );
//       setFollowUp(followUpQuestion);
//       setPhase("followup");
//       setDisFlag(false); // ← follow-up type karne ke liye wapas enable
//       return;
//     }

//     // phase === "followup" wala case
//     const newRound = {
//       topic: questions[questionIndex].topic,
//       question: questions[questionIndex].question,
//       answer: finalAnswer,
//       followUp: followUp,
//       followUpAnswer: finalFollowUpAnswer,
//     };
//     addPerformanceRound(newRound);

//     // Last question check
//     if (questionIndex >= questions.length - 1) {
//       setTransition("complete");
//       setDisFlag(true);
//       setIsEvaluating(true);

//       const firstIntroRound = {
//         topic: "Introduction",
//         question: "Tell me about yourself",
//         answer: introAnswer,
//         followUp: "",
//         followUpAnswer: "",
//       };

//       const allRounds = [firstIntroRound, ...performanceData, newRound];
//       const userPerformance = await evaluateInterview(allRounds);

//       if (!user?.id) {
//         console.log("User not found, cannot save result");
//         navigate("/performance");
//         return;
//       }

//       const { error } = await supabase.from("interview_results").insert({
//         user_id: user?.id,
//         evaluation: { ...userPerformance, jobTitle: config?.jobTitle },
//       });

//       if (error) {
//         showToast("Failed to save your results", "error");
//       }

//       navigate("/performance");
//       return;
//     }

//     // agla question aane wala normal case
//     // Move to the next question
// setAnswer("");
// setFollowUp("");
// setFollowUpAnswer("");
// setTranscribedAnswer("");
// setTranscribedFollowUpAnswer("");

// setQuestionIndex((prev) => prev + 1);
// setPhase("question");
// setTransition("next");
// setDisFlag(false);
//   };

//   // Toggles audio recording, transcribes the captured speech, and updates the answer for the current interview phase.
//   const handleMicClick = async () => {
//     if (!isRecording) {
//       try {
//         // MediaRecorder start
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//         });
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (e) => chunks.push(e.data);
//         recorder.onstop = async () => {
//           const audioBlob = new Blob(chunks, { type: "audio/webm" });
//           console.log(audioBlob);
//           const text = await transcribeAudio(audioBlob);
//           if (phase === "question") {
//             setTranscribedAnswer(text);
//           } else if (phase === "intro") {
//             setIntroAnswer(text);
//           } else {
//             setTranscribedFollowUpAnswer(text);
//           }
//         };

//         recorder.start();
//         setMediaRecorder(recorder);

//         // Speech Recognition start
//         SpeechRecognition();
//         setIsRecording(true);
//       } catch (err) {
//         showToast("Microphone access denied", "error");
//         console.error(err);
//       }
//     } else {
//       mediaRecorder?.stop();
//       recognition?.stop();
//       setIsRecording(false);
//     }
//   };

//   // Updates the appropriate answer state based on the current interview phase.
//   const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

//     if (phase === "intro") {
//       setIntroAnswer(e.target.value)
//       return;
//     }

//     if (phase === "question") {
//       setAnswer(e.target.value);
//     } else {
//       setFollowUpAnswer(e.target.value);
//     }
//   };

//   // Confirms interview termination and clears the current interview progress before returning to the dashboard.
//   const handleEndInterview = () => {
//     const confirmed = window.confirm(
//       "Are you sure you want to end the interview? Your progress will be lost.",
//     );
//     if (confirmed) {
//       clearConfig();
//       navigate("/dashboard");
//     }
//   };

//   // Initializes speech recognition and updates the appropriate answer field with the user's spoken transcript.
//   const SpeechRecognition = () => {
//     // @ts-expect-error - SpeechRecognition types not fully defined in TS lib// @ts-expect-error
//     const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recog = new SpeechRecognitionAPI();
//     recog.continuous = true;
//     recog.interimResults = true;

//     recog.onresult = (event: SpeechRecognitionEvent) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0].transcript)
//         .join("");

//       if (phase === "intro") {
//         setIntroAnswer(transcript);
//       } else if (phase === "question") {
//         setAnswer(transcript);
//       } else {
//         setFollowUpAnswer(transcript);
//       }
//     };

//     recog.start();
//     setRecognition(recog);
//   };

//   return (
//     <>
//       {/* Protect interview from browser Back/Forward navigation */}
//       <InterviewNavigationGuard />
//       {/* Show browser warning when user tries to reload/leave interview */}
//       <InterviewReloadGuard />

//       <div className="relative min-h-screen flex justify-center items-center bg-black overflow-hidden">
//         {isEvaluating && (
//           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 gap-3">
//             <p className="text-zinc-300 text-sm">
//               Evaluating your performance...
//             </p>
//           </div>
//         )}
//         <div className="relative z-10 mx-auto flex w-full max-w-6xl h-160 flex-col overflow-hidden rounded-2xl glass shadow-[0_8px_40px_rgba(0,0,0,0.06)] lg:flex-row">
//           {/* Left sidebar */}
//           <aside className="flex w-full flex-col gap-5 border-b border-zinc-800 p-6 lg:w-[35%] lg:border-b-0 lg:border-r lg:p-8 overflow-y-auto">
//             <div className="relative shrink-0 overflow-hidden rounded-xl">
//               <video
//                 ref={videoRef}
//                 src="/Interviewer2.mp4"
//                 loop
//                 muted
//                 playsInline
//                 className="h-52 w-full object-cover"
//               />
//               <div className="pointer-events-none absolute inset-0 bg-black/25" />
//             </div>

//             <div className="rounded-xl bg-[#1A1A1A]/70 px-4 py-3 shrink-0">
//               <InterviewerMessage
//   key={currentSpokenText}
//   text={currentSpokenText}
//   speechPosition={speechPosition}
//   speechComplete={speechComplete}
// />
//             </div>

//             {config?.timerEnabled && (
//               <div className="bg-[#1A1A1A]/80 rounded-xl py-3 px-4 shrink-0">
//                 <h1 className="text-zinc-500 text-xs">TIMER</h1>
//                 <div className="flex justify-center py-3">
//                   <CircularTimer seconds={100} />
//                 </div>
//               </div>
//             )}
//           </aside>

//           {/* Main panel */}
//           <main className="flex w-full flex-1 min-h-0 flex-col gap-4 p-6 lg:w-[66%] lg:p-8">
//             {/* Question panel */}
//             {phase !== "intro" && (
//               <div className="rounded-xl bg-[#1A1A1A]/80 px-5 py-5 min-h-16 max-h-40 shrink-0 overflow-y-auto flex flex-col justify-center">
//                 <p className="mb-2 text-sm text-zinc-500">{`Question ${questionIndex * 2 + (phase === "question" ? 1 : 2)} of ${questions.length * 2}`}</p>
//                 <p className="text-base leading-relaxed text-zinc-300 sm:text-md">
//                   <TypingEffect
//                     text={
//                       phase === "question"
//                         ? questions[questionIndex].question
//                         : followUp
//                     }
//                   />
//                 </p>
//               </div>
//             )}

//             {/* Answer Panel */}
//             <textarea
//               value={
//                 phase === "intro"
//                   ? introAnswer
//                   : phase === "question"
//                     ? answer
//                     : followUpAnswer
//               }
//               onChange={handleTextArea}
//               placeholder="Type your answer here..."
//               className="flex-1 min-h-0 w-full resize-none rounded-xl bg-[#1A1A1A]/80 px-4 py-4 text-zinc-300 placeholder:text-gray-400 outline-none transition focus:ring-1 focus:ring-white/60"
//             />

//             <div className="flex items-center gap-4 shrink-0">
//               {/* mic button */}
//               <button
//                 type="button"
//                 aria-label="Record answer"
//                 onClick={() => handleMicClick()}
//                 className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full ${isRecording ? "bg-red-500/40 animate-pulse" : "bg-white/30"} text-white transition hover:bg-gray-800`}
//               >
//                 {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
//               </button>
//               {/* submit button */}
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={disFlag}
//                 className="flex-1 cursor-pointer rounded-xl bg-white/30 py-2.5 text-sm font-semibold text-white backdrop-blur transition sm:text-base hover:bg-gray-800"
//               >
//                 {isEvaluating
//                   ? "Evaluating your performance..."
//                   : "Next question"}
//               </button>
//               {/* Interview end button */}
//               <button
//                 type="button"
//                 aria-label="End interview"
//                 onClick={handleEndInterview}
//                 className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/30 text-white transition hover:bg-red-500/60"
//               >
//                 <X />
//               </button>
//             </div>

//             <div className="flex items-center justify-center gap-1 text-zinc-500 text-xs shrink-0">
//               <TriangleAlert size={12} />
//               <span>Do not refresh the page during interview</span>
//             </div>
//           </main>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Interview;

// New re-factored version of interview.tsx

// import { useRef } from "react";
// import { useInterviewStore } from "../store/useInterviewStore";
// import { useAuthStore } from "../store/useAuthStore";
// import { useInterviewQuestions } from "../Components/Interview/Interview_Components/hooks/useInterviewQuestions";
// import { useInterviewFlow } from "../Components/Interview/Interview_Components/hooks/useInterviewFlow";
// import { useSpeechSynthesis } from "../Components/Interview/Interview_Components/hooks/useSpeechSynthesis";
// import { useVoiceRecording } from "../Components/Interview/Interview_Components/hooks/useVoiceRecording";
// import InterviewNavigationGuard from "../Components/Interview/InterviewNavigationGuard";
// import InterviewReloadGuard from "../Components/Interview/InterviewReloadGuard";
// import InterviewSidebar from "../Components/Interview/Interview_Components/InterviewSidebar";
// import InterviewQuestion from "../Components/Interview/Interview_Components/InterviewQuestion";
// import InterviewAnswer from "../Components/Interview/Interview_Components/InterviewAnswer";
// import InterviewControls from "../Components/Interview/Interview_Components/InterviewControls";
// import EvaluationOverlay from "../Components/Interview/Interview_Components/EvaluationOverlay";
// import FailedUI from "../Components/Interview/FailedUI";

// const Interview = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const { config } = useInterviewStore();
//   const { showToast } = useAuthStore();

//   const { questions, loading, questionsError, retry } = useInterviewQuestions();

//   const {
//     phase,
//     questionIndex,
//     currentQuestion,
//     currentSpokenText,

//     answer,
//     introAnswer,
//     followUp,
//     followUpAnswer,

//     isEvaluating,
//     isSubmitDisabled,
//     // transition,

//     handleSubmit,
//     handleTranscript,
//     handleTextAnswer,
//     handleEndInterview,
//     handleTimerExpire,
//     handleSpeechComplete,
//   } = useInterviewFlow({
//     questions,
//   });

//   const { speechPosition, speechComplete } = useSpeechSynthesis({
//     text: currentSpokenText,
//     videoRef,
//     onSpeechComplete: handleSpeechComplete,
//   });

//   /*
//    * Voice recording
//    */
//   const { isRecording, toggleRecording } = useVoiceRecording({
//     onTranscript: handleTranscript,
//     showToast,
//   });

//   /*
//    * When the transition speech finishes,
//    * remove the transition so currentSpokenText
//    * becomes the actual question.
//    *
//    * Example:
//    *
//    * "Thank you. Here is your next question."
//    *          ↓ speechComplete
//    * transition = null
//    *          ↓
//    * actual question
//    *          ↓
//    * speech hook speaks question
//    */

//   const currentAnswer =
//     phase === "intro"
//       ? introAnswer
//       : phase === "question"
//         ? answer
//         : followUpAnswer;

//   /*
//    * Keep these guards in this order:
//    *
//    * 1. Questions error
//    * 2. Loading
//    * 3. Empty questions
//    *
//    * This prevents the empty state from appearing
//    * while questions are still being generated.
//    */

//   if (questionsError) {
//     return <FailedUI onRetry={retry} />;
//   }

//   if (loading) {
//     return (
//       <div className="bg-black h-screen flex justify-center items-center">
//         <p className="text-zinc-400">Preparing your interview...</p>
//       </div>
//     );
//   }

//   if (!questions.length) {
//     return <FailedUI onRetry={retry} />;
//   }

//   return (
//     <>
//       <InterviewNavigationGuard />

//       <InterviewReloadGuard />

//       <div className="relative min-h-screen flex justify-center items-center bg-black overflow-hidden">
//         <EvaluationOverlay visible={isEvaluating} />

//         <div className="relative z-10 mx-auto flex w-full max-w-6xl h-160 flex-col overflow-hidden rounded-2xl glass shadow-[0_8px_40px_rgba(0,0,0,0.06)] lg:flex-row">
//           <InterviewSidebar
//             videoRef={videoRef}
//             message={currentSpokenText}
//             speechPosition={speechPosition}
//             speechComplete={speechComplete}
//             timerEnabled={config?.timerEnabled}
//             timerKey={`${questionIndex}-${phase}`}
//             onTimerComplete={handleTimerExpire}
//           />

//           <main className="flex w-full flex-1 min-h-0 flex-col gap-4 p-6 lg:w-[66%] lg:p-8">
//             {phase !== "intro" && currentQuestion && (
//               <InterviewQuestion
//                 questionIndex={questionIndex} // ← seedha questionIndex do ✅
//                 totalQuestions={questions.length}
//                 phase={phase}
//                 question={phase === "question" ? currentQuestion : followUp}
//               />
//             )}

//             <InterviewAnswer
//               value={currentAnswer}
//               onChange={handleTextAnswer}
//             />

//             <InterviewControls
//               isRecording={isRecording}
//               isSubmitDisabled={isSubmitDisabled}
//               isEvaluating={isEvaluating}
//               onMicClick={toggleRecording}
//               onSubmit={handleSubmit}
//               onEndInterview={handleEndInterview}
//             />
//           </main>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Interview;

import { useRef } from "react";
import { useInterviewStore } from "../store/useInterviewStore";
import { useAuthStore } from "../store/useAuthStore";
import { useInterviewQuestions } from "../Components/Interview Re-design components/hooks/useInterviewQuestions";
import { useInterviewFlow } from "../Components/Interview Re-design components/hooks/useInterviewFlow";
// import { useSpeechSynthesis } from "../Components/Interview Re-design components/hooks/useSpeechSynthesis";
import { useVoiceRecording } from "../Components/Interview Re-design components/hooks/useVoiceRecording";
import EvaluationOverlay from "../Components/Interview Re-design components/EvaluationOverlay";
import InterviewHeader from "../Components/Interview Re-design components/InterviewHeader";
import InterviewQuestion from "../Components/Interview Re-design components/InterviewQuestion";
import InterviewAnswer from "../Components/Interview Re-design components/InterviewAnswer";
import InterviewSidebar from "../Components/Interview Re-design components/InterviewSidebar";
import InterviewControls from "../Components/Interview Re-design components/InterviewControls";
import FailedUI from "../Components/Interview Re-design components/FailedUI";
import InterviewNavigationGuard from "../Components/Interview Re-design components/InterviewNavigationGuard";
import InterviewReloadGuard from "../Components/Interview Re-design components/InterviewReloadGuard";
import { useTextToSpeech } from "../Components/Interview Re-design components/hooks/useTextToSpeech";

const Interview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { config } = useInterviewStore();
  const { showToast } = useAuthStore();

  const { questions, loading, questionsError, retry } = useInterviewQuestions();

  const {
    phase,
    questionIndex,
    currentQuestion,
    currentSpokenText,

    answer,
    introAnswer,
    followUp,
    followUpAnswer,

    isEvaluating,
    isSubmitDisabled,
    // transition,

    handleSubmit,
    handleTranscript,
    handleTextAnswer,
    handleEndInterview,
    handleTimerExpire,
    handleSpeechComplete,
  } = useInterviewFlow({
    questions,
  });

  const { audioReady } = useTextToSpeech({
    text: currentSpokenText,
    videoRef,
    onSpeechComplete: handleSpeechComplete,
    loading,
  });

  /*
   * Voice recording
   */
  const { isRecording, isTranscribing, toggleRecording } = useVoiceRecording({
    onTranscript: handleTranscript,
    showToast,
  });

  const currentAnswer =
    phase === "intro"
      ? introAnswer
      : phase === "question"
        ? answer
        : followUpAnswer;

  if (questionsError) {
    return <FailedUI onRetry={retry} />;
  }

  if (loading) {
    return (
      <div className="bg-black h-screen flex justify-center items-center">
        <p className="text-zinc-400">Preparing your interview...</p>
      </div>
    );
  }

  if (!questions.length) {
    return <FailedUI onRetry={retry} />;
  }

  return (
    <>
      <InterviewNavigationGuard />

      <InterviewReloadGuard />

      <div className="relative min-h-screen bg-[#070707] text-white lg:pb-0">
        <EvaluationOverlay visible={isEvaluating} />
        <InterviewHeader onEndInterview={handleEndInterview} />

        <main className="mx-auto flex max-w-360 flex-col gap-4 p-3 pb-24 sm:p-5 sm:pb-28 lg:h-[calc(100vh-65px)] lg:flex-row lg:gap-5 lg:pb-5">
          <InterviewSidebar
            videoRef={videoRef}
            message={audioReady ? currentSpokenText : ""}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            phase={phase}
          />
          <section className="flex w-full flex-col gap-4 lg:w-100 lg:shrink-0">
            {phase !== "intro" && currentQuestion && audioReady && (
              <InterviewQuestion
                questionIndex={questionIndex}
                totalQuestions={questions.length}
                phase={phase}
                question={phase === "question" ? currentQuestion : followUp}
              />
            )}

           {phase !== "intro" && currentQuestion && !audioReady && (
  <div className="rounded-xl border border-white/10 bg-white/3 p-4">
    <div className="mb-2 flex items-center justify-between">
      <div className="h-2.5 w-24 rounded bg-white/10 animate-pulse" />

      <div className="h-5 w-24 rounded-full bg-white/10 animate-pulse" />
    </div>

    <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
  </div>
)}


            <InterviewAnswer
              value={currentAnswer}
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              onChange={handleTextAnswer}
            />
            <div className="hidden lg:block">
              <InterviewControls
                isRecording={isRecording}
                isSubmitDisabled={isSubmitDisabled}
                onMicClick={toggleRecording}
                onSubmit={handleSubmit}
                onEndInterview={handleEndInterview}
                phase={phase}
                timerEnabled={config?.timerEnabled}
                seconds={120} // ← add karo
                key={`${questionIndex}-${phase}`} // ← timerKey ki jagah key
                onComplete={handleTimerExpire} // ← onTimerComplete ki jagah onComplete
              />
            </div>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5 lg:hidden">
          <InterviewControls
            isRecording={isRecording}
            isSubmitDisabled={isSubmitDisabled}
            onMicClick={toggleRecording}
            onSubmit={handleSubmit}
            onEndInterview={handleEndInterview}
            phase={phase}
            timerEnabled={config?.timerEnabled}
            seconds={120} // ← add karo
            key={`${questionIndex}-${phase}`} // ← timerKey ki jagah key
            onComplete={handleTimerExpire} // ← onTimerComplete ki jagah onComplete
          />
        </div>
      </div>
    </>
  );
};

export default Interview;
