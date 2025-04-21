import React, { useEffect, useRef, useState } from "react";

import {
  DEFAULT_NOTIFICATION_DURATION,
  DEFAULT_NOTIFICATION_TRANSITION,
} from "../constants";

export default function Notification({ content, setNotificationContent }) {
  const notificationRef = useRef(null);

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!content) return;
    setActive(true);
    setTimeout(() => {
      setActive(false);
      setTimeout(() => {
        setNotificationContent(null);
      }, DEFAULT_NOTIFICATION_TRANSITION);
    }, DEFAULT_NOTIFICATION_TRANSITION + DEFAULT_NOTIFICATION_DURATION);
  }, [content]);

  return (
    <div
      ref={notificationRef}
      className={
        "untouchable sketcher-notification" +
        (active ? " sketcher-notification-active" : "")
      }
    >
      {content?.msg}
    </div>
  );
}
