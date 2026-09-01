import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { textToSpeech, playMp3Audio } from "../../../services/edgeTTs";

type UseTextToSpeechProps = {
  text?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onSpeechComplete?: () => void;
  loading: boolean;
};

// Fallback: browser's own voice, used only if Edge-TTS fails
const speakWithBrowserFallback = (
  text: string,
  videoRef: RefObject<HTMLVideoElement | null>
): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => videoRef.current?.play();
    utterance.onend = () => {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      resolve();
    };
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

export const useTextToSpeech = ({
  text,
  videoRef,
  onSpeechComplete,
  loading,
}: UseTextToSpeechProps) => {
  const speechIdRef = useRef(0);
  const [audioReady, setAudioReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!text?.trim()) return;

    const speechId = ++speechIdRef.current;
    let cancelled = false;

    const run = async () => {
      setAudioReady(false);
      setIsSpeaking(false);

      try {
        const audioBase64 = await textToSpeech(text);

        if (cancelled || speechId !== speechIdRef.current) return;

        setAudioReady(true);
        setIsSpeaking(true);
        videoRef.current?.play();

        await playMp3Audio(audioBase64);

        if (cancelled || speechId !== speechIdRef.current) return;

        setIsSpeaking(false);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        onSpeechComplete?.();
      } catch (error) {
        console.error("Edge TTS failed, falling back to browser voice:", error);
        if (cancelled || speechId !== speechIdRef.current) return;

        // Safety net — app kabhi stuck nahi hogi
        setAudioReady(true);
        setIsSpeaking(true);

        await speakWithBrowserFallback(text, videoRef);

        if (cancelled || speechId !== speechIdRef.current) return;
        setIsSpeaking(false);
        onSpeechComplete?.();
      }
    };

    run();

    return () => {
      cancelled = true;
      window.speechSynthesis.cancel();
    };
  }, [text, videoRef, onSpeechComplete, loading]);

  return { audioReady, isSpeaking };
};