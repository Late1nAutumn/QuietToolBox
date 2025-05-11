import React, { useEffect, useState } from "react";

export default function Modal({ component }) {
  const [active, setActive] = useState(false); // for curtain transition
  useEffect(() => {
    setActive(true);
  }, []);

  return (
    component && (
      <>
        <div className={"modal modal" + (active ? "-active" : "-inactive")} />
        <div className="modal-container">{component}</div>
      </>
    )
  );
}
