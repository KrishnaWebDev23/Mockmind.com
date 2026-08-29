import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuestions } from "../../../services/gemini";
import { useAuthStore } from "../../../store/useAuthStore";
import { useInterviewStore } from "../../../store/useInterviewStore";
import type { InterviewQuestion } from "../types";
import { supabase } from "../../../lib/supabaseClient";



export const useInterviewQuestions = () => {
  const navigate = useNavigate();
  const { showToast } = useAuthStore();
  const { config } = useInterviewStore();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(false);
  const [latestResult, setLatestResult] = useState();
  const { user } =  useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      if (!config) {
        showToast("Please fill the form", "info");
        navigate("/dashboard");
        return;
      }

      try {
        setLoading(true);
        setQuestionsError(false);

        const data = await generateQuestions({config, latestResult: latestResult ?? []});

        if (cancelled) return;

        if (!data.valid) {
          showToast(data.reason, "error");
          setQuestionsError(true);
          return;
        }

        setQuestions(data.questions);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to generate interview questions:",
          error,
        );

        setQuestionsError(true);
        showToast("Failed to generate questions", "error");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [config, navigate, showToast,latestResult]);

  useEffect(() => {
    let cancelled = false;

    const fetchLatestResult = async () => {
      const { data } = await supabase
      .from("interview_results")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

      if(cancelled) return

      setLatestResult(data.evaluation.questionScores.map((q: {questionId:string, question: string }) => ({
        questionId: q.questionId,question: q.question
      })))
    };

    fetchLatestResult()

    return () => {
     cancelled = true;
    };

  },[user?.id]);

  const retry = async () => {
    if (!config) {
      showToast("Please fill the form", "info");
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);
      setQuestionsError(false);

      const data = await generateQuestions(config); 

      if (!data.valid) {
        showToast(data.reason, "error");
        setQuestionsError(true);
        return;
      }

      setQuestions(data.data ?? data.questions);
    } catch (error) {
      console.error(
        "Failed to generate interview questions:",
        error,
      );

      setQuestionsError(true);
      showToast("Failed to generate questions", "error");
    } finally {
      setLoading(false);
    }
  };

  // console.log("Performance data", latestResult)

  return {
    questions,
    loading,
    questionsError,
    retry,
  };
};