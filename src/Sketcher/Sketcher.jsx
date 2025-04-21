import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { APP, APPS } from "../utils/constants";
import { DIRECTION } from "../utils/enums";
import { CANVAS_MARGIN, DEFAULT_IMG_LINK } from "./constants";
import { EDITOR_INDEX, LINE_COMMAND, NOTIFICATION_TYPE } from "./enum";
import { translator } from "./translation/translator";
import {
  NOTIFICATION_CONTEXT,
  TRANSLATE_COLLECTION,
  WORK_AREA_CONTEXT,
} from "./translation/context";
import { useGlobal } from "../context/GlobalContext";

import { onLeavePage, rgbToHex, setFavicon } from "../utils/functions";
import { pointsToPathD } from "./utils";

import PathManager from "./components/PathManager";
import Tools from "./components/Tools";
import Notification from "./components/Notification";
import Modal from "./components/Modal";
import NexusButton from "../Home/NexusButton/NexusButton";
import ModalExitConfirm from "./components/ModalExitConfirm";

export default function Sketcher() {
  const { lang } = useGlobal();
  const navigate = useNavigate();

  const imgRef = useRef(null);
  const colorPickerRef = useRef(null);
  const colorPickerContextRef = useRef(null);
  const keyEventCallback = useRef({}); // used: z, v, c

  const [paths, setPaths] = useState([
    {},
    // {
    //   display: true,
    //   points: [{ cmd: "L", x: 0, y: 0 }],
    //   closing: false,
    //   stroke: "#ffffff",
    //   fill: "transparent",
    //   fillEven: false,
    //   pointCount: 0,
    // },
  ]);
  const [imgUrl, setImgUrl] = useState(DEFAULT_IMG_LINK);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [imgZoom, setImgZoom] = useState(100);
  const [cursorCoord, setCurorCoord] = useState({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState("#ffffff");
  const [showCursor, setShowCursor] = useState(true);
  const [pixelColorDisplay, setPixelColorDisplay] = useState("");

  const [editorIndex, setEditorIndex] = useState(EDITOR_INDEX.IDLE);
  const [pathCommand, setPathCommand] = useState("L");

  const [modalComponent, setModalComponent] = useState(null);
  const [notificationContent, setNotificationContent] = useState(null);

  const onImgLoad = () => {
    let { width, height } = imgRef.current;
    // console.log(width, height);
    colorPickerContextRef.current = colorPickerRef.current.getContext("2d");
    colorPickerRef.current.width = width;
    colorPickerRef.current.height = height;
    colorPickerContextRef.current.drawImage(
      imgRef.current,
      0,
      0,
      width,
      height
    );
    setImgSize({ width, height });
    setImgZoom(100);
    URL.revokeObjectURL(imgUrl);
  };

  const onImgError = () => {
    setImgUrl("");
    setNotificationContent({
      type: NOTIFICATION_TYPE.FAIL,
      msg: translator(
        NOTIFICATION_CONTEXT.IMG_ERROR,
        lang,
        TRANSLATE_COLLECTION.NOTIFICATION
      ),
    });
  };

  const onCursorMove = (e) => {
    let zoomRatio = imgZoom / 100;
    let x = Math.round(((e.clientX - CANVAS_MARGIN) / zoomRatio) * 1000) / 1000,
      y = Math.round(((e.clientY - CANVAS_MARGIN) / zoomRatio) * 1000) / 1000;
    setCurorCoord({ x, y });
  };

  const onCanvasClick = () => {
    if (editorIndex === EDITOR_INDEX.IDLE) return;
    let { x, y } = cursorCoord;
    let temp = paths.slice();
    // TODO: l or L
    let point = {};
    switch (pathCommand) {
      case LINE_COMMAND.LINE_TO_ABSOLUTE:
        point = { cmd: pathCommand, x, y };
        break;
      case LINE_COMMAND.LINE_TO_RELATIVE:
        point = {
          cmd: pathCommand,
          x: x - editingPathLastCoord.x,
          y: y - editingPathLastCoord.y,
        };
        break;
    }
    temp[editorIndex].points.push(point);
    if (temp[editorIndex].pointCount !== "?") temp[editorIndex].pointCount++;
    setPaths(temp);
  };

  const onHoming = () => {
    setModalComponent(
      <ModalExitConfirm
        setModalComponent={setModalComponent}
        onConfirm={() => {
          navigate("/");
        }}
      />
    );
    return false; // exit in handled on modal confirm
  };

  const pendingPathD = () => {
    if (paths[editorIndex]?.points?.length) {
      let lastPoint =
        paths[editorIndex].points[paths[editorIndex].points.length - 1];
      let d = `M${lastPoint.x} ${lastPoint.y}L${cursorCoord.x} ${cursorCoord.y}`;
      // if (paths[editorIndex].closing) {
      //   let startPoint = paths[editorIndex].points[0];
      //   d += `L${startPoint.x} ${startPoint.y}`;
      // }
      return d;
    }
    return "";
  };

  const onKey = (e) => {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea") return;
    let func = keyEventCallback.current[e.key.toLowerCase()];
    if (func) {
      func();
    }
  };

  useEffect(() => {
    document.title = APPS[APP.SKETCHER].text;
    setFavicon(APPS[APP.SKETCHER].favicon);
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeavePage);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeavePage);
    };
  }, []);

  useEffect(() => {
    if (
      cursorCoord.x < 0 ||
      cursorCoord.x > imgSize.width ||
      cursorCoord.y < 0 ||
      cursorCoord.y > imgSize.height
    )
      setPixelColorDisplay("");
    let output = "";
    if (colorPickerContextRef.current) {
      let pixel = colorPickerContextRef.current.getImageData(
        cursorCoord.x,
        cursorCoord.y,
        1,
        1
      ).data;
      if (pixel) {
        output += rgbToHex(...pixel);
        if (pixel[3] !== 255) output += ` ${Math.round(pixel[3] / 2.55)}%`;
        setPixelColorDisplay(output);
      }
    }
  }, [cursorCoord, imgSize, colorPickerContextRef]);

  return (
    <div className="sketcher">
      <Modal component={modalComponent} />
      <Notification
        content={notificationContent}
        setNotificationContent={setNotificationContent}
      />

      <div className="sketcher-top-right-container">
        <Tools
          keyEventCallback={keyEventCallback}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          setImgSize={setImgSize}
          imgZoom={imgZoom}
          setImgZoom={setImgZoom}
          cursorColor={cursorColor}
          setCursorColor={setCursorColor}
          showCursor={showCursor}
          setShowCursor={setShowCursor}
        />
        <div className="sketcher-nexus">
          <NexusButton menuDirection={DIRECTION.BOTTOM} onHoming={onHoming} />
        </div>
      </div>

      <div className="sketcher-bottom-right-container">
        <PathManager
          keyEventCallback={keyEventCallback}
          paths={paths}
          setPaths={setPaths}
          editorIndex={editorIndex}
          setEditorIndex={setEditorIndex}
          setModalComponent={setModalComponent}
          setNotificationContent={setNotificationContent}
          imgSize={imgSize}
          pixelColorDisplay={pixelColorDisplay}
        />
      </div>

      <div
        className="sketcher-image"
        style={{
          transform: `scale(${imgZoom / 100})`,
          top: `${CANVAS_MARGIN}px`,
          left: `${CANVAS_MARGIN}px`,
          transformOrigin: "0 0",
        }}
      >
        {imgUrl ? (
          <img
            ref={imgRef}
            src={imgUrl}
            onLoad={onImgLoad}
            onError={onImgError}
            alt="image load fail"
            crossOrigin="anonymous"
          />
        ) : (
          <b>
            {translator(
              WORK_AREA_CONTEXT.NO_IMG_ALT,
              lang,
              TRANSLATE_COLLECTION.WORK_AREA
            )}
          </b>
        )}
      </div>

      <div
        className="sketcher-paths"
        style={{
          transform: `scale(${imgZoom / 100})`,
          top: "0",
          left: "0",
          transformOrigin: `${CANVAS_MARGIN}px ${CANVAS_MARGIN}px`,
        }}
      >
        <svg
          width={imgSize.width + 2 * CANVAS_MARGIN}
          height={imgSize.height + 2 * CANVAS_MARGIN}
          viewBox={`${0 - CANVAS_MARGIN} ${0 - CANVAS_MARGIN} ${
            imgSize.width + 2 * CANVAS_MARGIN
          } ${imgSize.height + 2 * CANVAS_MARGIN}`}
          onMouseMove={onCursorMove}
          onClick={onCanvasClick}
        >
          {paths
            .map(({ display, points, closing, stroke, fill, fillEven }, i) =>
              display && i !== editorIndex && i !== EDITOR_INDEX.NEW ? (
                <path
                  d={pointsToPathD(points, closing)}
                  stroke={stroke}
                  fill={fill}
                  fillRule={fillEven ? "evenodd" : "nonzero"}
                  key={i}
                />
              ) : (
                <path key={i} />
              )
            )
            .reverse()}
          {editorIndex !== EDITOR_INDEX.IDLE && (
            <>
              <path
                d={pointsToPathD(
                  paths[editorIndex].points,
                  paths[editorIndex].closing
                )}
                stroke={paths[editorIndex].stroke}
                fill={paths[editorIndex].fill}
                fillRule={paths[editorIndex].fillEven ? "evenodd" : "nonzero"}
              />
              <path
                d={pendingPathD()}
                stroke={paths[editorIndex].stroke}
                fill={paths[editorIndex].fill}
                fillRule={paths[editorIndex].fillEven ? "evenodd" : "nonzero"}
              />
            </>
          )}
          {/* <rect
            width={imgSize.width}
            height={imgSize.height}
            x="0"
            y="0"
            fill="transparent"
            stroke="red"
          /> */}
          {showCursor && imgUrl && (
            <>
              <line
                y1={0 - CANVAS_MARGIN}
                y2={imgSize.height + CANVAS_MARGIN}
                x1={cursorCoord.x - 0.5}
                x2={cursorCoord.x - 0.5}
                stroke={cursorColor}
              />
              <line
                x1={0 - CANVAS_MARGIN}
                x2={imgSize.width + CANVAS_MARGIN}
                y1={cursorCoord.y - 0.5}
                y2={cursorCoord.y - 0.5}
                stroke={cursorColor}
              />
            </>
          )}
        </svg>
      </div>

      <div className="sketcher-coord">
        <b>
          ({cursorCoord.x},{cursorCoord.y})
        </b>
        &nbsp;{pixelColorDisplay}
      </div>
      <canvas ref={colorPickerRef} className="sketcher-colorPicker" />
    </div>
  );
}
