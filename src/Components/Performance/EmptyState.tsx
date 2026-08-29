import { FileSearchCorner  } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex h-[calc(100vh-24px)] items-center justify-center px-6">
      <div className="max-w-xl text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <FileSearchCorner className="h-28 w-28 text-zinc-600" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white">
          No Interview Performance Available
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-400">
          It looks like you haven't completed any interview yet. Once you
          finish an interview, your performance analysis, scores, and detailed
          insights will appear here automatically.
        </p>

        {/* Preview Section */}
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-left">
          <h3 className="mb-4 text-lg font-semibold text-white">
            This page will include
          </h3>

          <ul className="space-y-3 text-sm text-zinc-400">
            <li>✓ Overall interview assessment score</li>
            <li>✓ Question-wise performance chart</li>
            <li>✓ Category-wise skill evaluation</li>
            <li>✓ AI-generated strengths & improvement areas</li>
            <li>✓ Personalized interview feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;