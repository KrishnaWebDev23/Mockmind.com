import { TriangleAlert } from 'lucide-react'
import  { useNavigate } from 'react-router-dom'
import { useInterviewStore } from '../../store/useInterviewStore'

type FailedUIProps = {
  onRetry: () => void;
};



const FailedUI = ({onRetry } : FailedUIProps) => {
    const navigate = useNavigate();
    const  {clearConfig} = useInterviewStore();
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <TriangleAlert className="text-red-400" size={28} />
        </div>

        <h1 className="text-xl font-semibold text-white">
          We couldn't prepare your interview
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          We were unable to generate your interview questions right now.
          Please try again. Your interview has not started yet.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full cursor-pointer rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => {
              clearConfig();
              navigate("/dashboard");
            }}
            className="w-full cursor-pointer rounded-xl border border-zinc-700 bg-transparent py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default FailedUI