import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  APPS,
  APP_IMG_GRID_SIZE,
  APP_IMG_SIZE,
  SCREEN_THRESHOLD,
} from "../utils/constants";
import Portrait from "./Portrait";
import Chatbox from "./Portrait/Chatbox";
import NexusButton from "./NexusButton/NexusButton";
import { DIRECTION } from "../utils/enums";

export default function Home({ scrollY, setScrollY }) {
  const [animationEnded, setAnimationEnded] = useState(false);

  const APP_LIST = Object.values(APPS);

  const onScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.scrollTo(0, scrollY);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const appImgGrids = () => {
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
    APP_LIST.forEach(() => {
      switch (true) {
        case middleY > threshold4:
          grids.push({ size: APP_IMG_SIZE.MIN });
          break;
        case middleY > threshold3:
          grids.push({ size: APP_IMG_SIZE.MIN + (threshold4 - middleY) * d });
          break;
        case middleY > threshold2:
          grids.push({ size: APP_IMG_SIZE.MAX, focus: true });
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
    return grids;
  };

  const grids = appImgGrids();

  return (
    <div className="home untouchable">
      <div className="home-background">
        {grids.map(({ focus }, i) => (
          <div
            className={"home-background-title" + (focus ? "-focus" : "")}
            key={i}
          >
            {APP_LIST[i].text}
          </div>
        ))}
        <div className="home-background-focused-title">
          {APP_LIST[grids.findIndex(({ focus }) => focus)]?.text || ""}
        </div>
      </div>
      <div className="home-content">
        <div className="home-content-head">
          {animationEnded && <Chatbox />}
          <Portrait
            skipped={true}
            active={true}
            onAnimationEnd={() => {
              setAnimationEnded(true);
            }}
          />
        </div>
        <div className="home-content-apps">
          <table>
            <tbody>
              {grids.map(({ size, focus }, i) => (
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
