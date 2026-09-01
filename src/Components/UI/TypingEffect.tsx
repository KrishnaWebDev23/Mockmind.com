
import { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  cursor?: string;
  className?: string;
  onComplete?: () => void;
}

interface TypingTextProps {
  text: string;
  speed: number;
  cursor?: string;
  onComplete?: () => void;
}

function TypingText({
  text,
  speed,
  cursor,
  onComplete,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) {
      return;
    }

    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;

      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <>
      {displayedText}

      {cursor && (
        <span className="ml-0.5 animate-pulse">
          {cursor}
        </span>
      )}
    </>
  );
}

export function TypingEffect({
  text,
  speed = 75,
  cursor,
  className = "",
  onComplete,
}: TypingEffectProps) {
  return (
    <span className={className}>
      <TypingText
        key={text}
        text={text}
        speed={speed}
        cursor={cursor}
        onComplete={onComplete}
      />
    </span>
  );
}
