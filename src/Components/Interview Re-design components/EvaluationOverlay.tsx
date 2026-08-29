type EvaluationOverlayProps = {
  visible: boolean;
};

const EvaluationOverlay = ({
  visible,
}: EvaluationOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 gap-3">
      <p className="text-zinc-300 text-sm">
        Evaluating your performance...
      </p>
    </div>
  );
};

export default EvaluationOverlay;