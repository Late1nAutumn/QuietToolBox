import React, { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { isMobile } from "./utils/functions";

export default function RootWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile() && !location.pathname.startsWith("/mobile")) {
      navigate("/mobile", { replace: true });
    }
  }, [location]);

  return <Outlet />;
}
