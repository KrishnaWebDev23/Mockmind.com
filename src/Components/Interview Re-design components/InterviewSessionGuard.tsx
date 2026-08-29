import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InterviewSessionGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interviewReloaded =
      sessionStorage.getItem("interviewReloaded");

    if (
      interviewReloaded === "true" &&
      location.pathname === "/interview"
    ) {
      // Remove the flag so it doesn't redirect forever
      sessionStorage.removeItem("interviewReloaded");

      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

export default InterviewSessionGuard;