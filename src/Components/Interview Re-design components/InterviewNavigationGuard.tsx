import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InterviewNavigationGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/interview") return;

    // Create a history entry for the current interview page
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // User pressed Back or Forward.
      // Put them back on the interview page.
      window.history.pushState(null, "", window.location.href);

      // Make React Router aware that we're still on /interview
      navigate("/interview", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  return null;
};

export default InterviewNavigationGuard;