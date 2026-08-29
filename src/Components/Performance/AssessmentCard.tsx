type CategoryScore = {
  score: number;
  feedback: string;
};

type AssessmentCardProps = {
  categoryScores?: {
    communicationSkills: CategoryScore;
    technicalKnowledge: CategoryScore;
    problemSolving: CategoryScore;
    confidenceClarity: CategoryScore;
  };
};

const AssessmentCard = ({ categoryScores }: AssessmentCardProps) => {
  if (!categoryScores) return null;

  // Calculate Average
  const average =
    (
      categoryScores.communicationSkills.score +
      categoryScores.technicalKnowledge.score +
      categoryScores.problemSolving.score +
      categoryScores.confidenceClarity.score
    ) / 4;

  const percentage = Math.round(average);

  // Convert to 5-star rating
  const rating = ((percentage / 100) * 5).toFixed(1);

  // Recommendation
  const recommendation =
    percentage >= 90
      ? "Outstanding"
      : percentage >= 80
      ? "Strong Hire"
      : percentage >= 70
      ? "Hire"
      : percentage >= 60
      ? "Borderline"
      : "Not Recommended";

  // Confidence
  const confidence =
    percentage >= 80
      ? "High"
      : percentage >= 60
      ? "Medium"
      : "Low";

  // Progress Color
  const progressColor =
    percentage >= 80
      ? "#22c55e"
      : percentage >= 60
      ? "#f59e0b"
      : "#ef4444";

  // SVG Progress
  const size = 180;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const dashOffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:p-6">
      {/* Header */}
      <div className="mb-5 text-center sm:mb-6">
        <h3 className="text-lg font-semibold text-white sm:text-xl">
          Overall Assessment
        </h3>

        <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
          Interview assessment average
        </p>
      </div>

      {/* Score */}
      <div className="relative mb-6 flex justify-center sm:mb-8">
        {/* Glow */}
        <div
          className="absolute inset-0 m-auto h-32 w-32 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: progressColor }}
        />

        <div
          className="relative flex items-center justify-center"
          style={{
            width: size,
            height: size,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
          >
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#27272a"
              strokeWidth={strokeWidth}
            />

            {/* Progress */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={progressColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2
              className="font-bold tracking-tight text-white"
              style={{
                fontSize: size * 0.22,
                lineHeight: 1,
              }}
            >
              {percentage}%
            </h2>

            <p
              className="mt-2 text-zinc-400"
              style={{
                fontSize: size * 0.08,
              }}
            >
              Overall Score
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mb-6 flex justify-center">
        <span
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold sm:text-sm ${
            percentage >= 80
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : percentage >= 60
              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {recommendation}
        </span>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
        {/* Rating */}
        <div className="px-3 py-4 text-center sm:px-4">
          <p className="text-lg font-semibold text-white sm:text-xl">
            {rating}
            <span className="ml-1 text-yellow-400">★</span>
          </p>

          <p className="mt-1 text-[11px] text-zinc-500 sm:text-xs">
            Avg Rating
          </p>
        </div>

        {/* Confidence */}
        <div className="border-l border-zinc-800 px-3 py-4 text-center sm:px-4">
          <p
            className={`text-lg font-semibold sm:text-xl ${
              confidence === "High"
                ? "text-emerald-400"
                : confidence === "Medium"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {confidence}
          </p>

          <p className="mt-1 text-[11px] text-zinc-500 sm:text-xs">
            Confidence
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;