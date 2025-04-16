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

const apps = [
  { link: "/nikki", text: "nikki kiwi" },
  { link: "/sketcher", text: "Sketcher" },
  { link: "/steamster", text: "Steamster" },
  { link: "/", text: "4" },
  { link: "/", text: "5" },
  { link: "/", text: "6" },
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

  const appImgSize = () => {
    let sizes = [];
    let middleY = window.innerHeight / 2;
    let a = window.innerHeight / 2 + scrollY,
      b = window.innerHeight * SCREEN_THRESHOLD.FULL_ZOOM_OUT,
      c = window.innerHeight * SCREEN_THRESHOLD.FULL_ZOOM_IN,
      d = (APP_IMG_SIZE.MAX - APP_IMG_SIZE.MIN) / (b - c);
    let threshold1 = a - b,
      threshold2 = a - c,
      threshold3 = a + c,
      threshold4 = a + b;
    apps.forEach(() => {
      switch (true) {
        case middleY > threshold4:
          sizes.push(APP_IMG_SIZE.MIN);
          break;
        case middleY > threshold3:
          sizes.push(APP_IMG_SIZE.MIN + (threshold4 - middleY) * d);
          break;
        case middleY > threshold2:
          sizes.push(APP_IMG_SIZE.MAX);
          break;
        case middleY > threshold1:
          sizes.push(APP_IMG_SIZE.MIN + (middleY - threshold1) * d);
          break;
        default:
          sizes.push(APP_IMG_SIZE.MIN);
          break;
      }
      middleY += APP_IMG_GRID_SIZE;
    });
    return sizes;
  };

  return (
    <div className="home">
      <div className="home-icon-background">
        <NexusIcon />
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
              {appImgSize().map((size, i) => (
                <tr key={i}>
                  <td>
                    <Link to={apps[i].link}>
                      <div
                        className="home-content-app"
                        style={{
                          width: `${Math.floor(size)}px`,
                          height: `${Math.floor(size)}px`,
                        }}
                      >
                        {apps[i].text}
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
