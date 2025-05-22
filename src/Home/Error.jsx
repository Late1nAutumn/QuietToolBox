import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NexusIcon } from "../svg/NexusIcon";
import { ERROR_PAGE_TYPE } from "../utils/enums";

const SPINNER_DISPLAY_DELAY = 2000;
const REDIRECT_DELAY = 2000;

export default function Error({ pageType }) {
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
    if (pageType === ERROR_PAGE_TYPE.NOT_FOUND)
      window.addEventListener("load", startRedirect);
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("load", startRedirect);
    };
  }, []);

  let title, message;
  switch (pageType) {
    case ERROR_PAGE_TYPE.NOT_FOUND:
      title = "404";
      message = "Page not found";
      break;
    case ERROR_PAGE_TYPE.MOBILE:
      title = "Sorry\n ";
      message = "Mobile is not supported for now. Please visit through computer";
      break;
  }

  return (
    <div className="error untouchable">
      <div className="error-content">
        <h1>{title}</h1>
        <h5>{message}</h5>
        <div className="error-content-spinner">
          {spinner && (
            <svg viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="violet"
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
