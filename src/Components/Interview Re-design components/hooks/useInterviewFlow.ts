import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getFollowUp } from "../../../services/groq";
import { evaluateInterview } from "../../../services/gemini";
import { supabase } from "../../../lib/supabaseClient";

import { useAuthStore } from "../../../store/useAuthStore";
import { useInterviewStore } from "../../../store/useInterviewStore";
import { usePerformanceStore } from "../../../store/usePerformanceStore";

import { INTRO_ROUND } from "../constants";

import type {
  InterviewPhase,
  InterviewQuestion,
  InterviewTransition,
  PerformanceRound,
} from "../types";

type UseInterviewFlowProps = {
  questions: InterviewQuestion[];
};

export const useInterviewFlow = ({
  questions,
}: UseInterviewFlowProps) => {

  const navigate = useNavigate();

  const { user, showToast } = useAuthStore();

  const { config, clearConfig } = useInterviewStore();

  const {
    addPerformanceRound,
    performanceData,
  } = usePerformanceStore();

  const [phase, setPhase] = useState<InterviewPhase>("intro");

  const [questionIndex, setQuestionIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [introAnswer, setIntroAnswer] = useState("");

  const [followUpAnswer, setFollowUpAnswer] = useState("");

  const [transcribedAnswer, setTranscribedAnswer] = useState("");

  const [transcribedFollowUpAnswer,setTranscribedFollowUpAnswer] = useState("");

  const [followUp, setFollowUp] = useState("");

  const [isEvaluating, setIsEvaluating] = useState(false);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [transition, setTransition] = useState<InterviewTransition>(null);

  const currentQuestion = questions[questionIndex]?.question;

  const currentAnswer =
    phase === "intro"
      ? introAnswer
      : phase === "question"
        ? answer
        : followUpAnswer;

  const finalAnswer =
    transcribedAnswer.trim()
      ? transcribedAnswer
      : answer;

  const finalFollowUpAnswer =
    transcribedFollowUpAnswer.trim()
      ? transcribedFollowUpAnswer
      : followUpAnswer;

  /*
   * The text that should currently be spoken.
   *
   * IMPORTANT:
   *
   * Transition text has priority.
   * Otherwise the current phase determines
   * what should be spoken.
   */
  const currentSpokenText =
    transition === "intro"
      ? "Thank you for introducing yourself. Let's start with your first question."
      : transition === "next"
        ? "Thank you. Here is your next question."
        : transition === "complete"
          ? "Thank you for your time and for answering all the questions. That concludes your interview. Your responses are now being evaluated. Please wait a moment while we prepare your performance."
          : phase === "intro"
            ? "Hello! Welcome to your mock interview session. I'm your AI interviewer today, and I'll be guiding you through a few questions related to your role. Before we dive into the questions, please introduce yourself — your background and experience."
            : phase === "question"
              ? currentQuestion
              : followUp;

  /*
   * Called by useSpeechSynthesis ONLY after
   * the current utterance has completely finished.
   */
  const handleSpeechComplete = useCallback(() => {
      /*
       * Intro transition finished.
       *
       * NOW, and only now, move into the
       * actual question phase.
       */
      if (transition === "intro") {
        setTransition(null);
        setPhase("question");
        return;
      }

      /*
       * Next-question transition finished.
       *
       * NOW move to the next actual question.
       */
      if (transition === "next") {
        setTransition(null);
        setPhase("question");
        return;
      }

      /*
       * Complete transition doesn't need to
       * change phase because evaluation is already
       * running.
       */
    }, [transition]);

  /*
   * Move from the current follow-up to
   * the next question.
   *
   * Notice that we DO NOT immediately set
   * phase = "question".
   *
   * We first play the transition.
   */
const moveToNextQuestion = useCallback(() => {
  setAnswer("")
  setFollowUp("")
  setFollowUpAnswer("")
  setTranscribedAnswer("")
  setTranscribedFollowUpAnswer("")
  setQuestionIndex((previous) => previous + 1)
  setPhase("question")
  setTransition("next")
  setIsSubmitDisabled(false)
}, []) // ← empty array — sirf setters hain jo stable hain

  const completeInterview = useCallback(async (
  newRound: PerformanceRound,
) => {
  setTransition("complete")
  setIsSubmitDisabled(true)
  setIsEvaluating(true)

  const introRound = {
    ...INTRO_ROUND,
    answer: introAnswer,
  }

  const allRounds = [
    ...performanceData,
    newRound,
  ]

  try {
    const userPerformance = await evaluateInterview({allRounds, introRound})

    if (!user?.id) {
      navigate("/performance")
      return
    }

    const { error } = await supabase
      .from("interview_results")
      .insert({
        user_id: user.id,
        evaluation: {
          ...userPerformance,
          jobTitle: config?.jobTitle,
        },
      })

    if (error) {
      showToast("Failed to save your results", "error")
    }

    navigate("/performance")
  } catch (error) {
    console.error("Failed to evaluate interview:", error)
    showToast("Failed to evaluate your interview", "error")
    setIsEvaluating(false)
    setIsSubmitDisabled(false)
  }
}, [introAnswer, performanceData, user, config, navigate, showToast]) // ← dependencies

  const handleSubmit = async () => {
     if (isSubmitDisabled) return // ← extra guard ✅
    if (!currentAnswer.trim()) {
      showToast(
        "Answer cannot be empty",
        "error",
      );
      return;
    }

    if (currentAnswer.trim().length < 20) {
      showToast(
        "Answer is too short, please elaborate",
        "error",
      );
      return;
    }

    setIsSubmitDisabled(true);

    /*
     * INTRO
     *
     * Do NOT change phase yet.
     *
     * We want:
     *
     * intro
     * ↓
     * intro transition
     * ↓
     * question
     */
    if (phase === "intro") {
      setTransition("intro");

      /*
       * The button can be enabled because
       * the user is not submitting another answer
       * during the transition.
       */
      setIsSubmitDisabled(false);

      return;
    }

    /*
     * MAIN QUESTION
     */
    if (phase === "question") {
      try {
        const followUpQuestion =
          await getFollowUp(
            questions[questionIndex]
              .question,
            finalAnswer,
          );

        setFollowUp(
          followUpQuestion,
        );

        setPhase("followup");
        setIsSubmitDisabled(false);
      } catch (error) {
        console.error(
          "Failed to generate follow-up:",
          error,
        );

        showToast(
          "Failed to generate follow-up question",
          "error",
        );

        setIsSubmitDisabled(false);
      }
      return;
    }

    /*
     * FOLLOW-UP
     */
    const newRound: PerformanceRound = {
      topic: questions[questionIndex].topic,
      question: questions[questionIndex].question,
      answer: finalAnswer,
      followUp: followUp,
      followUpAnswer:finalFollowUpAnswer,
    };

    addPerformanceRound(newRound);

    const isLastQuestion = questionIndex >= questions.length - 1;
    if (isLastQuestion) {
      await completeInterview(
        newRound,
      );

      return;
    }

    moveToNextQuestion();
  };

  const handleTranscript = (
    transcript: string,
  ) => {
    if (phase === "intro") {
      setIntroAnswer(transcript);
      return;
    }

    if (phase === "question") {
      setAnswer(transcript);
      setTranscribedAnswer(
        transcript,
      );
      return;
    }

    setFollowUpAnswer(transcript);

    setTranscribedFollowUpAnswer(
      transcript,
    );
  };

  const handleTextAnswer = (
    value: string,
  ) => {
    if (phase === "intro") {
      setIntroAnswer(value);
      return;
    }

    if (phase === "question") {
      setAnswer(value);
      return;
    }

    setFollowUpAnswer(value);
  };

  const handleEndInterview = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to end the interview? Your progress will be lost.",
      );

    if (!confirmed) return;

    clearConfig();

    navigate("/dashboard");
  };


  const handleTimerExpire = useCallback(async () => {
  if (phase === "intro") {
    setTransition("intro")
    setPhase("question")
    setIsSubmitDisabled(false)
    return
  }

  if (phase === "question") {
    try {
      const followUpQuestion = await getFollowUp(
        questions[questionIndex].question,
        answer || "I don't know",
      )
      setFollowUp(followUpQuestion)
      setPhase("followup")
      setIsSubmitDisabled(false)
    } catch {
      setPhase("followup")
      setFollowUp("Can you elaborate more on this topic?")
      setIsSubmitDisabled(false)
    }
    return
  }

  if (phase === "followup") {
    const newRound: PerformanceRound = {
      topic: questions[questionIndex].topic,
      question: questions[questionIndex].question,
      answer: finalAnswer || "No answer provided",
      followUp: followUp,
      followUpAnswer: finalFollowUpAnswer || "No answer provided",
    }

    addPerformanceRound(newRound)

    const isLastQuestion = questionIndex >= questions.length - 1
    if (isLastQuestion) {
      await completeInterview(newRound)
      return
    }

    moveToNextQuestion()
  }
}, [phase, questions, questionIndex, answer, followUp, finalAnswer, finalFollowUpAnswer, addPerformanceRound, moveToNextQuestion, completeInterview])




  return {
    phase,
    questionIndex,

    currentQuestion,
    currentSpokenText,

    answer,
    introAnswer,
    followUp,
    followUpAnswer,

    transition,

    isEvaluating,
    isSubmitDisabled,

    handleSubmit,
    handleTranscript,
    handleTextAnswer,
    handleEndInterview,
    handleTimerExpire,
    handleSpeechComplete,
  };
};