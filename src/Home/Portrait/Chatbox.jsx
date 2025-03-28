import React, { useEffect, useRef, useState } from "react";
import { GREETING } from "./chatData";
import { IDLE_TIMEOUT } from "../../utils/constants";

export default function Chatbox({ focusedApp }) {
  const textUpdateTimeout = useRef(null);

  const [dialog, setDialog] = useState({
    // [{text:"", speed:30, wait:3000}]
    list: [],
    index: 0,
    displaying: "",
  });

  useEffect(() => {
    setDialog({ list: GREETING });
    return () => {
      clearTimeout(textUpdateTimeout.current);
    };
  }, []);
  useEffect(() => {
    // TODO:
  }, [focusedApp]);
  useEffect(() => {
    if (!dialog.list || !dialog.list.length) {
      setTimeout(() => {
        // TODO:
      }, IDLE_TIMEOUT.BASE_TIME + Math.random(IDLE_TIMEOUT.MAX_RANDOM_TIME));
    } else {
      clearTimeout(textUpdateTimeout.current);
      setDialog({
        ...dialog,
        index: 0,
        displaying: "",
      });
    }
  }, [dialog.list]);
  useEffect(() => {
    let target = dialog.list[dialog.index];
    if (!target) return;
    if (dialog.displaying.length < target.text.length) {
      // next text
      textUpdateTimeout.current = setTimeout(() => {
        setDialog({
          ...dialog,
          displaying: dialog.displaying + target.text[dialog.displaying.length],
        });
      }, target.speed || 0);
    } else if (dialog.index + 1 < dialog.list.length) {
      // next phrase
      textUpdateTimeout.current = setTimeout(() => {
        setDialog({
          ...dialog,
          index: dialog.index + 1,
          displaying: "",
        });
      }, target.wait || 0);
    } else {
      // end of dialog
      textUpdateTimeout.current = setTimeout(() => {
        setDialog({ list: [] });
      }, target.wait || 0);
    }
  }, [dialog.displaying, dialog.index]);

  return (
    <>
      {dialog.displaying && (
        <div className="home-content-chatbox">{dialog.displaying}</div>
      )}
    </>
  );
}
