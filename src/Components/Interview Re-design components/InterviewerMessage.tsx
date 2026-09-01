import { useEffect, useRef } from "react";
import { TypingEffect } from "../UI/TypingEffect";

type InterviewerMessageProps = {
  text: string;
};

export const InterviewerMessage = ({ text }: InterviewerMessageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [text]);

  return (
    <div
      key={text}
      ref={containerRef}
      className="sm:h-10 h-8 overflow-hidden text-xs sm:text-sm leading-4 sm:leading-5 text-zinc-300 animate-in fade-in duration-300"
    >
      <TypingEffect text={text} />
    </div>
  );
};