import { useEffect, useMemo, useRef } from "react";

type InterviewerMessageProps = {
  text: string;
  speechPosition?: number;
  speechComplete?: boolean;
};

export const InterviewerMessage = ({
  text,
  speechPosition,
  speechComplete = false,
}: InterviewerMessageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/) : [];
  }, [text]);

  const visibleWordCount = useMemo(() => {
    if (!words.length) {
      return 0;
    }

    // Speech has completely finished:
    // show the ENTIRE message.
    if (speechComplete) {
      return words.length;
    }

    // Speech has started but no boundary event yet.
    if (speechPosition === undefined) {
      return 1;
    }

    const spokenText = text.slice(0, speechPosition);

    const spokenWords = spokenText.trim()
      ? spokenText.trim().split(/\s+/).length
      : 1;

    return Math.min(
      spokenWords,
      words.length
    );
  }, [
    speechPosition,
    speechComplete,
    text,
    words,
  ]);

  const displayText = words
    .slice(0, visibleWordCount)
    .join(" ");

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [displayText]);

  return (
    <div
      ref={containerRef}
      className="sm:h-10 h-8 overflow-hidden text-xs sm:text-sm leading-4 sm:leading-5 text-zinc-300"
    >
      {displayText}
    </div>
  );
};