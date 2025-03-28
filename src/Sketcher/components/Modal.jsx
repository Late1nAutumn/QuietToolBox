import React from "react";

export default function Modal({ component }) {
  return component && <div className="sketcher-modal">{component}</div>;
}
