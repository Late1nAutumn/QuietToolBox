import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Languages } from "../../svg/Languages";
import { NexusIcon } from "../../svg/NexusIcon";
import { DIRECTION } from "../../utils/enums";
import { useGlobal } from "../../context/GlobalContext";

export default function NexusButton({ menuDirection, onHoming }) {
  const navigate = useNavigate();

  const { nextLanguage } = useGlobal();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {}, []);

  const onNexusButtonClick = () => {
    let navigating = true;
    if (onHoming) navigating = onHoming();
    // avoid undefined
    if (navigating !== false) navigate("/");
  };

  const menuClassName = () => {
    let prefix = "nexusButton-menu";
    let directionName = "";
    switch (menuDirection) {
      case DIRECTION.TOP:
        directionName = "top";
        break;
      case DIRECTION.RIGHT:
        directionName = "right";
        break;
      case DIRECTION.BOTTOM:
        directionName = "bottom";
        break;
      case DIRECTION.LEFT:
        directionName = "left";
        break;
    }
    return `${prefix}-${
      menuOpen ? "open" : "close"
    } ${prefix}-${directionName}`;
  };

  return (
    <div
      className="nexusButton"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="nexusButton-icon" onClick={onNexusButtonClick}>
        <NexusIcon />
      </div>
      <div className={menuClassName()}>
        <div className="nexusButton-menu-button" onClick={nextLanguage}>
          <Languages />
        </div>
      </div>
    </div>
  );
}
