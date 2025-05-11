import React from "react";

import { useGlobal } from "../../context/GlobalContext";

export default function ModalExitConfirm({
  setModalComponent,
  onConfirm,
  onCancel,
}) {
  const { lang } = useGlobal();

  const onConfirmClick = () => {
    if (onConfirm) onConfirm();
    setModalComponent(null);
  };

  const onCancelClick = () => {
    if (onCancel) onCancel();
    setModalComponent(null);
  };

  return (
    <div className="modal-content untouchable">
      <h2>I'm a title</h2>
      <div>I'm an article</div>
      <div className="modal-content-buttons">
        <button onClick={onConfirmClick}>Yas</button>
        <button onClick={onCancelClick}>Nein</button>
      </div>
    </div>
  );
}
