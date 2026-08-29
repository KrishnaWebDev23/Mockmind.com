import { useEffect } from "react";

const InterviewReloadGuard = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Remember that the interview was left/reloaded
      sessionStorage.setItem("interviewReloaded", "true");

      // Show browser's native warning
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default InterviewReloadGuard;