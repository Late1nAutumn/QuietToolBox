import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

import {
  APPS,
  AUTO_SCROLL_DELAY,
  APP_IMG_GRID_SIZE,
  APP_IMG_SIZE,
  HOME_FAVICON,
  HOME_TITLE,
  SCREEN_THRESHOLD,
} from "../utils/constants";
import { DIRECTION } from "../utils/enums";
import { setFavicon } from "../utils/functions";
import { generalTranslator } from "../utils/translation/translator";
import {
  CHAT_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../utils/translation/context";
import { LOCALSTORAGE, STORE } from "../utils/localStorage";

import Portrait from "./Portrait";
import Chatbox from "./Portrait/Chatbox";
import NexusButton from "./NexusButton/NexusButton";

export default function Home({ scrollY, setScrollY }) {
  const { lang } = useGlobal();
  const dialogCallbackRef = useRef(null);

  const [animationEnded, setAnimationEnded] = useState(false);
  const [appImgGrids, setAppImgGrids] = useState([]);
  const [userFocusedWindow, setUserFocusedWindow] = useState(false);

  const APP_LIST = Object.values(APPS);

  const onScroll = () => {
    setScrollY(window.scrollY);
  };

  const onUserFocus = () => {
    if (!document.hidden) setUserFocusedWindow(true);
  };

  useEffect(() => {
    document.title = HOME_TITLE;
    setFavicon(HOME_FAVICON);

    LOCALSTORAGE.initStore(STORE.MAIN);

    onUserFocus();
    document.addEventListener("visibilitychange", onUserFocus);

    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: scrollY,
        // behavior: "smooth",
      });
    }, AUTO_SCROLL_DELAY);

    window.addEventListener("scroll", onScroll);
    // not the best way triggering recalculation for resize, just being lazy
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onUserFocus);
    };
  }, []);

  useEffect(() => {
    let grids = [];
    let middleY = window.innerHeight / 2;
    let a = window.innerHeight / 2 + scrollY,
      b = window.innerHeight * SCREEN_THRESHOLD.FULL_ZOOM_OUT,
      c = window.innerHeight * SCREEN_THRESHOLD.FULL_ZOOM_IN,
      d = (APP_IMG_SIZE.MAX - APP_IMG_SIZE.MIN) / (b - c);
    let threshold1 = a - b,
      threshold2 = a - c,
      threshold3 = a + c,
      threshold4 = a + b;
    APP_LIST.forEach(({ intro }, i) => {
      switch (true) {
        case middleY > threshold4:
          grids.push({ size: APP_IMG_SIZE.MIN });
          break;
        case middleY > threshold3:
          grids.push({ size: APP_IMG_SIZE.MIN + (threshold4 - middleY) * d });
          break;
        case middleY > threshold2:
          grids.push({ size: APP_IMG_SIZE.MAX, focus: true });
          if (
            dialogCallbackRef.current &&
            appImgGrids[i] &&
            !appImgGrids[i].focus
          )
            dialogCallbackRef.current({
              list: [{ text: intro[lang], speed: 15 }],
            });
          break;
        case middleY > threshold1:
          grids.push({ size: APP_IMG_SIZE.MIN + (middleY - threshold1) * d });
          break;
        default:
          grids.push({ size: APP_IMG_SIZE.MIN });
          break;
      }
      middleY += APP_IMG_GRID_SIZE;
    });
    setAppImgGrids(grids);
  }, [scrollY]);

  useEffect(() => {
    if (dialogCallbackRef.current)
      dialogCallbackRef.current({
        list: [
          {
            text: generalTranslator(
              CHAT_CONTEXT.LANG_SWITCH,
              lang,
              TRANSLATION_COLLECTION.CHAT
            ),
            speed: 30,
          },
        ],
      });
  }, [lang]);

  return (
    <div className="home untouchable">
      <div className="home-background">
        {appImgGrids.map(({ focus }, i) => (
          <div
            className={"home-background-title" + (focus ? "-focus" : "")}
            key={i}
          >
            {APP_LIST[i].text}
          </div>
        ))}
        <div className="home-background-focused-title">
          {APP_LIST[appImgGrids.findIndex(({ focus }) => focus)]?.text || ""}
        </div>
      </div>
      <div className="home-content">
        <div className="home-content-head">
          {animationEnded && <Chatbox dialogCallbackRef={dialogCallbackRef} />}
          {userFocusedWindow && (
            <Portrait
              skipped={LOCALSTORAGE[STORE.MAIN].getIsPortraitSkipped()}
              active={true}
              onAnimationEnd={() => {
                setAnimationEnded(true);
                LOCALSTORAGE[STORE.MAIN].setSkipPortrait();
              }}
            />
          )}
        </div>
        <div className="home-content-apps">
          <table>
            <tbody>
              {appImgGrids.map(({ size, focus }, i) => (
                <tr key={i}>
                  <td>
                    <Link to={APP_LIST[i].link}>
                      <div
                        className="home-content-app"
                        style={{
                          width: `${Math.floor(size)}px`,
                          height: `${Math.floor(size)}px`,
                        }}
                      >
                        {APP_LIST[i].cover ? (
                          <img src={APP_LIST[i].cover} />
                        ) : (
                          APP_LIST[i].text
                        )}
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="home-content-nexus">
          <NexusButton menuDirection={DIRECTION.RIGHT} />
        </div>
      </div>
    </div>
  );
}
