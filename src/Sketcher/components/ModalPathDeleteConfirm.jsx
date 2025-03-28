import React from "react";

export default function ModalPathDeleteConfirm({
  setModalComponent,
  onConfirm,
}) {
  return (
    <div className="sketcher-model-content untouchable">
      <h2>Deleting Path</h2>
      <div>This path will be removed permanently</div>
      <div>All content will be lost</div>
      <div className="sketcher-model-content-buttons">
        <button onClick={onConfirm}>Sure!</button>
        <button onClick={() => setModalComponent(null)}>Hold on</button>
      </div>
    </div>
  );
}
