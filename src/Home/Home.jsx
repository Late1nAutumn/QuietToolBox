import React, { useEffect, useState } from "react";
import { NexusIcon } from "../svg/NexusIcon";
import { Link } from "react-router-dom";
import {
  APP_IMG_GRID_SIZE,
  APP_IMG_SIZE,
  SCREEN_THRESHOLD,
} from "../utils/constants";
import Portrait from "./Portrait";
import Chatbox from "./Portrait/Chatbox";
import NexusButton from "./NexusButton/NexusButton";
import { DIRECTION } from "../utils/enums";

const APPS = [
  { link: "/nikki", text: "Nikki Kiwi", cover: "./asset/nikkikiwiCover.png" },
  { link: "/sketcher", text: "Sketcher", cover: "./asset/sketcherCover.png" },
  {
    link: "/steamster",
    text: "Steamster",
    cover: "./asset/steamsterCover.png",
  },
  {
    link: "/",
    text: "Diver Trainer",
    cover: "./asset/underConstructionCover.png",
  },
  { link: "/", text: "Dashboard", cover: "./asset/underConstructionCover.png" },
  // { link: "/", text: "6" },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [animationEnded, setAnimationEnded] = useState(false);

  useEffect(() => {
    if (window.onscroll === null)
      window.onscroll = () => setScrollY(window.scrollY);
    return () => {
      window.onscroll = null;
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
    APPS.forEach(() => {
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
            {APPS[i].text}
          </div>
        ))}
        <div className="home-background-focused-title">
          {APPS[grids.findIndex(({ focus }) => focus)]?.text || ""}
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
                    <Link to={APPS[i].link}>
                      <div
                        className="home-content-app"
                        style={{
                          width: `${Math.floor(size)}px`,
                          height: `${Math.floor(size)}px`,
                        }}
                      >
                        {APPS[i].cover ? (
                          <img src={APPS[i].cover} />
                        ) : (
                          APPS[i].text
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
