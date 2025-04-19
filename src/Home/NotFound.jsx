import React, { useEffect, useRef, useState } from "react";
import { NexusIcon } from "../svg/NexusIcon";
import { useNavigate } from "react-router-dom";

const SPINNER_DISPLAY_DELAY = 2000;
const REDIRECT_DELAY = 2000;

export default function NotFound() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const [spinner, setSpinner] = useState(false);

  const startRedirect = () => {
    timeoutRef.current = setTimeout(() => {
      setSpinner(true);
      timeoutRef.current = setTimeout(() => {
        navigate("/");
      }, REDIRECT_DELAY);
    }, SPINNER_DISPLAY_DELAY);
  };

  useEffect(() => {
    window.addEventListener("load", startRedirect);
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("load", startRedirect);
    };
  }, []);

  return (
    <div className="not-found untouchable">
      <div className="not-found-background">
        <NexusIcon />
      </div>
      <div className="not-found-content">
        <h1>404</h1>
        <h5>Page not found</h5>
        <div className="not-found-content-spinner">
          {spinner && (
            <svg viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="crimson"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
                stroke-dasharray="90, 150"
                stroke-dashoffset="0"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
