import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type UseSpeechSynthesisProps = {
  text?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onSpeechComplete?: () => void;
  loading: boolean
};

export const useSpeechSynthesis = ({
  text,
  videoRef,
  onSpeechComplete,
  loading
}: UseSpeechSynthesisProps) => {
  const selectedVoiceRef =
    useRef<SpeechSynthesisVoice | null>(null);

  const utteranceRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  const speechIdRef = useRef(0);

  const [speechPosition, setSpeechPosition] =
    useState<number | undefined>(undefined);

  const [speechComplete, setSpeechComplete] =
    useState(false);

  /*
   * Load available browser voices.
   */
  useEffect(() => {
    const loadVoices = () => {
      const voices =
        window.speechSynthesis.getVoices();

      const preferredVoice = voices.find(
        (voice) => {
          const name = voice.name.toLowerCase();

          return (
            name.includes("male") ||
            name.includes("david") ||
            name.includes("mark") ||
            name.includes("alex") ||
            name.includes("daniel")
          );
        },
      );

      selectedVoiceRef.current =
        preferredVoice ?? voices[0] ?? null;
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices,
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices,
      );

      window.speechSynthesis.cancel();
    };
  }, []);

  /*
   * Speak whenever the requested text changes.
   */
  useEffect(() => {

    if(loading) return

    if (!text?.trim()) {
      return;
    }

    const speechId = ++speechIdRef.current;

    /*
     * Stop anything currently speaking.
     */
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utteranceRef.current = utterance;

    if (selectedVoiceRef.current) {
      utterance.voice =
        selectedVoiceRef.current;
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      /*
       * Ignore old utterances.
       */
      if (speechId !== speechIdRef.current) {
        return;
      }

      setSpeechPosition(0);
      setSpeechComplete(false);

      videoRef.current?.play();
    };

    utterance.onboundary = (event) => {
      if (speechId !== speechIdRef.current) {
        return;
      }

      if (
        typeof event.charIndex === "number"
      ) {
        setSpeechPosition(event.charIndex);
      }
    };

    utterance.onend = () => {
      if (speechId !== speechIdRef.current) {
        return;
      }

      setSpeechComplete(true);

      videoRef.current?.pause();

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }

      /*
       * Tell the interview flow that this specific
       * speech has completely finished.
       */
      onSpeechComplete?.();
    };

    utterance.onerror = () => {
      if (speechId !== speechIdRef.current) {
        return;
      }

      setSpeechComplete(true);

      videoRef.current?.pause();

      onSpeechComplete?.();
    };

    window.speechSynthesis.speak(
      utterance,
    );

    /*
     * When text changes, invalidate this utterance.
     */
   return () => {
  window.speechSynthesis.cancel();
};
  }, [
    text,
    videoRef,
    onSpeechComplete,
    loading
  ]);

  return {
    speechPosition,
    speechComplete,
  };
};