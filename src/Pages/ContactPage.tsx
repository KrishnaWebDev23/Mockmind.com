import { useState } from "react";
import {
  MessageSquare,
  Bug,
  AlertTriangle,
  Lightbulb,
  Send,
  CheckCircle2,
  X
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type FeedbackType = "feedback" | "complaint" | "bug" | "suggestion";

const Contact = () => {
  const [type, setType] = useState<FeedbackType>("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setIsSubmitting(true);

  try {
    const { error } = await supabase.functions.invoke("contact-form", {
      body: {
        type,
        name,
        email,
        subject,
        message,
      },
    });

    if (error) {
      throw error;
    }

    setSubmitted(true);

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setType("feedback");
  } catch (error) {
    console.error("Failed to submit:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  /* =============================================================
     SUCCESS SCREEN
  ============================================================= */

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center overflow-y-auto bg-[#070707] px-5 py-10 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/8 bg-white/3 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
            <CheckCircle2 size={28} className="text-green-400" />
          </div>

          <h1 className="text-xl font-semibold">Thank you for reaching out</h1>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Your message has been received. We appreciate you taking the time to
            help us improve the website.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 rounded-xl bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-y-auto bg-[#070707] text-white lg:h-screen lg:min-h-0 lg:overflow-hidden">

    <button
      type="button"
      onClick={() => (window.location.href = "/")}
      aria-label="Go to home"
      className="fixed right-5 top-5 z-50 flex h-10 w-13 items-center justify-center rounded-md cursor-pointer border border-white/10 bg-white/5 text-white/50 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
    >
      <X size={18} />
    </button>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:h-full lg:min-h-0">
        {/* =======================================================
            HEADER
        ======================================================= */}

        <div className="shrink-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <MessageSquare size={15} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Contact & Support
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            We'd love to hear from you.
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-white/40 sm:text-sm">
            Found a problem, have some feedback, or want to suggest something?
            Let us know and we'll take a look.
          </p>
        </div>

        {/* =======================================================
            FORM WRAPPER

            MOBILE/TABLET:
            Normal document flow + scrolling

            DESKTOP:
            Remaining viewport height
        ======================================================= */}

        <div className="mt-6 flex flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col rounded-3xl border border-white/8 bg-white/2.5 p-4 shadow-2xl sm:p-5 lg:h-full lg:min-h-0 lg:p-6"
          >
            {/* ===================================================
                CATEGORY
            =================================================== */}
            <div className="shrink-0">
              <label className="mb-3 block text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
                What would you like to tell us?
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <TypeButton
                  active={type === "feedback"}
                  icon={<MessageSquare size={15} />}
                  label="Feedback"
                  onClick={() => setType("feedback")}
                />

                <TypeButton
                  active={type === "complaint"}
                  icon={<AlertTriangle size={15} />}
                  label="Complaint"
                  onClick={() => setType("complaint")}
                />

                <TypeButton
                  active={type === "bug"}
                  icon={<Bug size={15} />}
                  label="Report Bug"
                  onClick={() => setType("bug")}
                />

                <TypeButton
                  active={type === "suggestion"}
                  icon={<Lightbulb size={15} />}
                  label="Suggestion"
                  onClick={() => setType("suggestion")}
                />
              </div>
            </div>
            {/* ===================================================
                USER DETAILS
            =================================================== */}
            <div className="mt-5 grid shrink-0 gap-3 sm:grid-cols-2">
              <Input
                label="Your name"
                placeholder="Kartik"
                value={name}
                onChange={setName}
                required
              />

              <Input
                label="Email address"
                type="email"
                placeholder="kartik@gmail.com"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            {/* ===================================================
                SUBJECT
            =================================================== */}
            <div className="mt-3 shrink-0">
              <Input
                label="Subject"
                placeholder="What is this about?"
                value={subject}
                onChange={setSubject}
                required
              />
            </div>

            {/* ===================================================
                MESSAGE

                MOBILE/TABLET:
                Fixed minimum height so it doesn't collapse.

                DESKTOP:
                Takes remaining available space.
            =================================================== */}

            <div className="mt-4 flex min-h-55 flex-col lg:min-h-0 lg:flex-1">
              <label className="mb-2 block shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
                Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what happened or what you'd like us to know..."
                required
                className="min-h-45 w-full flex-1 resize-none rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-xs leading-6 text-white outline-none placeholder:text-white/20 transition focus:border-white/20 focus:bg-black/40 sm:min-h-50 sm:text-sm lg:min-h-0"
              />
            </div>

            {/* ===================================================
                SUBMIT

                IMPORTANT:
                Never flex into the textarea on mobile.
            =================================================== */}

            <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-white/6 pt-4 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-xs leading-4 text-white/25">
                We'll use your email only to respond to your message.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/6 px-5 text-[11px] font-medium text-white transition hover:border-white/15 hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={13} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* =======================================================
            FOOTER
        ======================================================= */}

        {/* <div className="mt-5 shrink-0 pb-1 text-center">

          <p className="text-[9px] text-white/20">
            We usually respond within 1–2 business days.
          </p>

        </div> */}
      </div>
    </div>
  );
};

/* ===============================================================
   TYPE BUTTON
=============================================================== */

type TypeButtonProps = {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const TypeButton = ({ active, icon, label, onClick }: TypeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-[10px] font-medium transition ${
        active
          ? "border-white/20 bg-white text-black"
          : "border-white/[0.07] bg-white/2.5 text-white/40 hover:bg-white/5 hover:text-white/70"
      }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

/* ===============================================================
   INPUT
=============================================================== */

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: InputProps) => {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-white/8 bg-black/30 px-4 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-white/20 focus:bg-black/40 sm:text-sm
        "
      />
    </div>
  );
};

export default Contact;
























