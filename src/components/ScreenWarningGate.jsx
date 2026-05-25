import React, { useEffect, useState } from "react";

import { isMobile } from "../utils/functions";
import Modal from "./Modal";
import ModalScreenWarning from "./ModalScreenWarning";

export default function ScreenWarningGate() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (
      window.innerWidth > 1920 ||
      window.innerHeight > 1080 ||
      isMobile()
    ) {
      setShowWarning(true);
    }
  }, []);

  return (
    <Modal
      component={
        showWarning && (
          <ModalScreenWarning onConfirm={() => setShowWarning(false)} />
        )
      }
    />
  );
}
