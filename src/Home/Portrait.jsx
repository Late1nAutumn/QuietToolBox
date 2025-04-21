import React, { useEffect, useRef, useState } from "react";

import { PORTRAIT_SIZE } from "./Portrait/portraitData";
import { PORTRAIT_EYE_TRACK_COOLDOWN } from "../utils/constants";

import Svg from "./Portrait/Svg";

// TODO: don't start anime when not looking at window

export default function Portrait({
  skipped,
  active, // to improve performance
  onAnimationEnd = () => {},
}) {
  let eyeballTrackCooldown = 0;
  let portraitContainerRef = useRef(null);

  const [eyeTrack, setEyeTrack] = useState(false);
  const [eyeballCoord, setEyeballCoord] = useState({
    lEyeX: 201,
    lEyeY: 376,
    rEyeX: 403,
    rEyeY: 373,
  });

  const computeEyeballCoordinate = (mouseX, mouseY) => {
    // need to be recalculated in case of resizing
    // assuming conteriner is position:fixed
    let obj = portraitContainerRef.current.getBoundingClientRect();
    let containerX = obj.x,
      containerY = obj.y,
      containerWidth = obj.width,
      containerHeight = obj.height;
    // console.log(containerX, containerY, containerWidth, containerHeight);
    let screenWidth = window.innerWidth,
      screenHeight = window.innerHeight;
    // if (width / height > PORTRAIT_SIZE.WIDTH / PORTRAIT_SIZE.HEIGHT)
    //   var canvasOffsetX =
    //       (width - (height / PORTRAIT_SIZE.HEIGHT) * PORTRAIT_SIZE.WIDTH) / 2 +
    //       x,
    //     canvasOffsetY = 0;
    // else
    //   var canvasOffsetX = x,
    //     canvasOffsetY =
    //       (height - (width / PORTRAIT_SIZE.WIDTH) * PORTRAIT_SIZE.HEIGHT) / 2;
    let glabellaX = (302 / PORTRAIT_SIZE.WIDTH) * containerWidth + containerX,
      glabellaY = (378 / PORTRAIT_SIZE.HEIGHT) * containerHeight + containerY;

    let calculate = (dx, dy, eyeX, eyeY) => {
      let distance = Math.sqrt(dx * dx + dy * dy);
      // 25% of screen diagonal
      let distanceLimit =
        Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight) / 4;
      let ratio = 10 / Math.max(distance, distanceLimit);
      return { x: eyeX + dx * ratio, y: eyeY + dy * ratio };
    };
    let leftEye = calculate(mouseX - glabellaX, mouseY - glabellaY, 201, 381);
    let rightEye = calculate(mouseX - glabellaX, mouseY - glabellaY, 405, 378);
    return {
      lEyeX: leftEye.x,
      lEyeY: leftEye.y,
      rEyeX: rightEye.x,
      rEyeY: rightEye.y,
    };
  };

  const updateEye = (e) => {
    if (!eyeTrack || !active) return;
    let time = new Date().getTime();
    if (time - eyeballTrackCooldown < PORTRAIT_EYE_TRACK_COOLDOWN) return; // prevent fps drop
    eyeballTrackCooldown = time;
    setEyeballCoord(computeEyeballCoordinate(e.clientX, e.clientY));
  };

  useEffect(() => {
    if (skipped) {
      onAnimationEnd();
      setEyeTrack(true);
    } else
      setTimeout(() => {
        console.log("[log]: canvas animation end");
        onAnimationEnd();
        setEyeTrack(true);
      }, 7500);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateEye);
    return () => {
      window.removeEventListener("mousemove", updateEye);
    };
  }, [eyeTrack, active]);

  return (
    <div ref={portraitContainerRef} className="home-content-portrait">
      <Svg
        eyeTrack={eyeTrack || skipped}
        lEyeX={eyeballCoord.lEyeX}
        lEyeY={eyeballCoord.lEyeY}
        rEyeX={eyeballCoord.rEyeX}
        rEyeY={eyeballCoord.rEyeY}
      />
    </div>
  );
}
