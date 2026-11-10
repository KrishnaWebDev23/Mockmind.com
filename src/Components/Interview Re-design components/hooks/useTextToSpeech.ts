import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type UseTextToSpeechProps = {
  text?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onSpeechComplete?: () => void;
  onSpeechError?: (message: string) => void;
  loading: boolean;
};

const MAX_CHUNK_CHARS = 220;
const FIRST_CHUNK_MIN_CHARS = 40;

const splitIntoChunks = (text: string): string[] => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? [clean];
  const pieces = sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .flatMap((sentence) =>
      sentence.length > 350 ? sentence.split(/(?<=[,;:])\s+/) : [sentence],
    );

  const chunks: string[] = [];
  let current = "";
  for (const piece of pieces) {
    const isFirstChunk = chunks.length === 0;
    const chunkIsFull = isFirstChunk
      ? current.length >= FIRST_CHUNK_MIN_CHARS
      : `${current} ${piece}`.length > MAX_CHUNK_CHARS;

    if (current && chunkIsFull) {
      chunks.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  }
  if (current) chunks.push(current);

  return chunks;
};

export const useTextToSpeech = ({
  text,
  videoRef,
  onSpeechComplete,
  onSpeechError,
  loading,
}: UseTextToSpeechProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const resumeSpeechRef = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef(onSpeechComplete);
  const onErrorRef = useRef(onSpeechError);
  const [blockedSpeechText, setBlockedSpeechText] = useState<string | null>(null);

  useEffect(() => {
    onCompleteRef.current = onSpeechComplete;
    onErrorRef.current = onSpeechError;
  }, [onSpeechComplete, onSpeechError]);

  useEffect(() => {
    const stopCurrentAudio = () => {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeAttribute("src");
        currentAudio.load();
        audioRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };

    stopCurrentAudio();
    videoRef.current?.pause();
    resumeSpeechRef.current = null;

    if (loading || !text?.trim()) return;

    const controller = new AbortController();
    let cancelled = false;
    let completed = false;
    const video = videoRef.current;

    const startVideo = () => {
      if (cancelled || !video) return;
      void video.play().catch((playError: unknown) => {
        console.warn("Interviewer video could not start:", playError);
      });
    };

    const finishSpeech = () => {
      if (cancelled || completed) return;

      completed = true;
      video?.pause();
      if (video) video.currentTime = 0;
      onCompleteRef.current?.();
    };

    const fetchAudio = async (chunk: string): Promise<Blob> => {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunk }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type")?.split(";")[0];
      if (!response.ok || contentType !== "audio/mpeg") {
        const body = await response.text();
        let detail =
          contentType !== "audio/mpeg"
            ? `TTS endpoint returned unexpected content type: ${contentType ?? "missing"}`
            : `TTS request failed (${response.status})`;
        if (body) {
          try {
            const parsed: unknown = JSON.parse(body);
            if (typeof parsed === "object" && parsed !== null) {
              if ("error" in parsed && typeof parsed.error === "string") {
                detail = parsed.error;
              } else if ("detail" in parsed && typeof parsed.detail === "string") {
                detail = parsed.detail;
              } else {
                detail = body.slice(0, 500);
              }
            } else {
              detail = body.slice(0, 500);
            }
          } catch {
            detail = body.slice(0, 500);
          }
        }
        throw new Error(detail);
      }

      const audio = await response.blob();
      if (!audio.size) throw new Error("Edge TTS returned an empty audio response");
      return audio;
    };

    const playBlob = (blob: Blob) =>
      new Promise<void>((resolve, reject) => {
        const audioUrl = URL.createObjectURL(blob);
        audioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audio.preload = "auto";
        audioRef.current = audio;

        let settled = false;

        const cleanup = () => {
          audio.onplay = null;
          audio.onended = null;
          audio.onerror = null;
          controller.signal.removeEventListener("abort", handleAbort);
          if (audioRef.current === audio) audioRef.current = null;
          if (audioUrlRef.current === audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrlRef.current = null;
          }
        };

        const settle = (error?: Error) => {
          if (settled) return;
          settled = true;
          cleanup();
          if (error) reject(error);
          else resolve();
        };

        const handleAbort = () =>
          settle(new Error("Speech playback was cancelled"));

        audio.onplay = () => {
          setBlockedSpeechText((current) => (current === text ? null : current));
          startVideo();
        };
        audio.onended = () => settle();
        audio.onerror = () => {
          const mediaError = audio.error;
          const detail = mediaError?.message || `media error ${mediaError?.code ?? "unknown"}`;
          settle(new Error(`Edge TTS audio playback failed: ${detail}`));
        };
        controller.signal.addEventListener("abort", handleAbort, { once: true });

        const attemptPlayback = () => {
          if (cancelled || controller.signal.aborted) return;

          void audio.play().catch((playError: unknown) => {
            if (
              playError instanceof DOMException &&
              playError.name === "NotAllowedError"
            ) {
              setBlockedSpeechText(text);
              return;
            }

            settle(
              playError instanceof Error
                ? playError
                : new Error("Edge TTS audio could not start"),
            );
          });
        };

        resumeSpeechRef.current = attemptPlayback;
        attemptPlayback();
      });

    const run = async () => {
      try {
        const chunks = splitIntoChunks(text);
        for (const chunk of chunks) {
          if (cancelled) return;

          const audio = await fetchAudio(chunk);
          if (cancelled) return;

          await playBlob(audio);
        }

        finishSpeech();
      } catch (error) {
        if (cancelled || controller.signal.aborted) return;

        const message =
          error instanceof Error ? error.message : "Text-to-speech failed";
        console.error("Edge TTS failed:", error);
        onErrorRef.current?.(message);
        finishSpeech();
      }
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
      resumeSpeechRef.current = null;
      stopCurrentAudio();
      video?.pause();
    };
  }, [text, videoRef, loading]);

  const resumeSpeech = useCallback(() => {
    resumeSpeechRef.current?.();
  }, []);

  return {
    needsUserGesture: blockedSpeechText === text,
    resumeSpeech,
  };
};
