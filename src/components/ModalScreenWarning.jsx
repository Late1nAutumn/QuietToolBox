import React from "react";

export default function ModalScreenWarning({ onConfirm }) {
  return (
    <div className="screen-warning">
      <h2>Heads up</h2>
      <p>
        This site hasn't tuned for larger displays or mobile devices.
        The layout may not render as intended.
      </p>
      <div className="screen-warning-actions">
        <button onClick={onConfirm}>I understand</button>
      </div>
    </div>
  );
}
