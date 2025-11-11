import React, { useEffect, useRef, useState } from "react";

import { NOTIFICATION_DURATION } from "../utils/constants";
import { NOTIFICATION_TYPE } from "../utils/enum";

export default function Notification({ data, index, removeLastNotification }) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      removeLastNotification();
    }, NOTIFICATION_DURATION);
  }, []);

  const className = () => {
    let base = "grainbrain-notification";
    switch (data.type) {
      case NOTIFICATION_TYPE.WARN:
        base += " grainbrain-notification-warn";
        break;
      case NOTIFICATION_TYPE.ERROR:
        base += " grainbrain-notification-error";
        break;
    }
    return base;
  };

  const notificationIconSrc = () => {
    let filename = "";
    switch (data.type) {
      case NOTIFICATION_TYPE.WARN:
      case NOTIFICATION_TYPE.ERROR:
        filename = "event_queue_high_priority";
        break;
      case NOTIFICATION_TYPE.INFO:
      default:
        filename = "event_queue_medium_priority";
        break;
    }
    return `./asset/aoe4/${filename}.png`;
  };

  return (
    <div className={className()} style={{ bottom: index * 40 }}>
      <span className="grainbrain-notification-message">{data.msg}</span>
      <span className="grainbrain-notification-icon">
        <img src={notificationIconSrc()} alt="notification_icon" />
      </span>
    </div>
  );
}
