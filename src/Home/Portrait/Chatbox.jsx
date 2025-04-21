import React, { useEffect, useRef, useState } from "react";
import { GOSSIP, GREETING } from "./chatData";
import {
  DEFAULT_CHATBOX_DIALOG_WAIT,
  DEFAULT_CHATBOX_PRASE_WAIT,
  DEFAULT_CHATBOX_TEXT_SPEED,
  IDLE_TIMEOUT,
} from "../../utils/constants";
import { useGlobal } from "../../context/GlobalContext";

export default function Chatbox({ dialogCallbackRef }) {
  const { lang } = useGlobal();
  const textUpdateTimeoutRef = useRef(null);
  const gossipTimeoutRef = useRef(null);
  const lastGossipRef = useRef(null);

  const [dialog, setDialog] = useState({
    list: [
      // {text:"", speed:30, wait:3000}
    ],
    index: 0,
    displaying: "",
  });

  useEffect(() => {
    setDialog({ list: GREETING(lang) });
    return () => {
      clearTimeout(textUpdateTimeoutRef.current);
      clearTimeout(gossipTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (dialog.list && dialog.list.length) {
      clearTimeout(textUpdateTimeoutRef.current);
      clearTimeout(gossipTimeoutRef.current);
      setDialog({
        ...dialog,
        index: 0,
        displaying: "",
      });
    }
    // gossip trigger can't put here since React init also meet the condition
  }, [dialog.list]);

  useEffect(() => {
    let target = dialog.list[dialog.index];
    if (!target) return;
    if (dialog.displaying.length < target.text.length) {
      // next text
      textUpdateTimeoutRef.current = setTimeout(() => {
        setDialog({
          ...dialog,
          displaying: dialog.displaying + target.text[dialog.displaying.length],
        });
      }, target.speed || DEFAULT_CHATBOX_TEXT_SPEED);
    } else if (dialog.index + 1 < dialog.list.length) {
      // next phrase
      textUpdateTimeoutRef.current = setTimeout(() => {
        setDialog({
          ...dialog,
          index: dialog.index + 1,
          displaying: "",
        });
      }, target.wait || DEFAULT_CHATBOX_PRASE_WAIT);
    } else {
      // end of dialog
      textUpdateTimeoutRef.current = setTimeout(() => {
        setDialog({ list: [] });

        // activate dialog callback only after greeting finished
        if (!dialogCallbackRef.current) dialogCallbackRef.current = setDialog;

        gossipTimeoutRef.current = setTimeout(() => {
          setDialog({ list: GOSSIP(lang, lastGossipRef) });
        }, IDLE_TIMEOUT.BASE_TIME + Math.random(IDLE_TIMEOUT.MAX_RANDOM_TIME));
      }, target.wait || DEFAULT_CHATBOX_DIALOG_WAIT);
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
