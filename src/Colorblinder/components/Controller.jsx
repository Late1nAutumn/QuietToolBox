import React, { useState, useEffect, useRef } from "react";
import {
  BRIGHTNESS_SENSITIVITY,
  COLOR_MODE,
  ELEVATION_SENSITIVITY,
  HUE_SENSITIVITY,
  INTERFACE_MODE,
  MAX_ALPHA,
  MAX_ALTITUDE,
  MAX_AZIMUTH,
  MAX_ELEVATION,
  MAX_HEIGHT_SCALE,
  MAX_RADIUS,
  MAX_RADIUS_SCALE,
  MAX_SPHERE_RADIUS,
  MIN_ALPHA,
  MIN_ALTITUDE,
  MIN_AZIMUTH,
  MIN_ELEVATION,
  MIN_HEIGHT_SCALE,
  MIN_RADIUS,
  MIN_RADIUS_SCALE,
  MIN_SATURATION,
  MIN_SPHERE_RADIUS,
  SATURATION_SENSITIVITY,
} from "../constants";
import { decimaling, preventDefault } from "../../utils/functions";
import { translator } from "../translation/translator";
import {
  CONTROLLER_CONTEXT,
  TRANSLATE_COLLECTION,
} from "../translation/context";
import { useGlobal } from "../../context/GlobalContext";
import { GL } from "../graphics";
import { Mouse } from "../../components/svg/Mouse";
import { ArrowUpDown } from "../../components/svg/ArrowUpDown";
import { ArrowLeftRight } from "../../components/svg/ArrowLeftRight";

export default function Controller({canvasRef,
  interfaceMode,
  setInterfaceMode,
  colorMode,
  setColorMode,
  elevation,
  setElevation,
  azimuth,
  setAzimuth,
  innerRadius,
  setInnerRadius,
  radiusScale,
  setRadiusScale,
  altitude,
  setAltitude,
  heightScale,
  setHeightScale,
  cylinderAlpha,
  setCylinderAlpha,
  sphereRadius,
  setSphereRadius,
}) {
  let { lang } = useGlobal();

  // #region mouse control
  const lmbDownRef = useRef(false);
  const rmbDownRef = useRef(false);

  function onMouseDown(e) {
    if (e.button == 0) lmbDownRef.current = true;
    else if (e.button == 2) rmbDownRef.current = true;
  }
  function onMouseUp(e) {
    if (e.button == 0) lmbDownRef.current = false;
    else if (e.button == 2) rmbDownRef.current = false;
  }
  function onMouseMove(e) {
    if (lmbDownRef.current) {
      if (e.movementY) {
        let value = elevation + ELEVATION_SENSITIVITY * e.movementY;
        if (GL.arcOffsetElevation(value) > MAX_ELEVATION)
          value = GL.offsetElevation(MAX_ELEVATION);
        else if (GL.arcOffsetElevation(value) < MIN_ELEVATION)
          value = GL.offsetElevation(MIN_ELEVATION);
        setElevation(value);
      }
      if (e.movementX) {
        let value = azimuth + HUE_SENSITIVITY * e.movementX;
        if (GL.arcOffsetHue(value) >= 360) value += 360;
        else if (GL.arcOffsetHue(value) < 0) value -= 360;
        setAzimuth(value);
      }
    }
    if (rmbDownRef.current && interfaceMode === INTERFACE_MODE.SELECTOR) {
      if (e.movementX) {
        let value = innerRadius + SATURATION_SENSITIVITY * e.movementX;
        if (value > 1) value = 1;
        else if (value < 0) value = 0;
        setInnerRadius(value);
      }
      if (e.movementY) {
        let value = altitude + BRIGHTNESS_SENSITIVITY * e.movementY;
        if (value > 1) value = 1;
        else if (value < -1) value = -1;
        setAltitude(value);
      }
    }
  }
  // #endregion

  useEffect(() => {
    window.addEventListener("contextmenu", preventDefault);
    return () => {
      window.removeEventListener("contextmenu", preventDefault);
    };
  }, []);

  useEffect(() => {
    canvasRef.current?.addEventListener("mousedown", onMouseDown);
    canvasRef.current?.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      canvasRef.current?.removeEventListener("mousedown", onMouseDown);
      canvasRef.current?.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [elevation, azimuth, innerRadius, altitude]);

  return (
    <div className="colorblinder-controller">
      <div className="colorblinder-controller-tabs">
        {[INTERFACE_MODE.SELECTOR, INTERFACE_MODE.DISPLAYER].map((enm, i) => (
          <div
            className={
              "colorblinder-controller-mode-button" +
              (interfaceMode === enm ? " active" : "")
            }
            key={i}
            onClick={() => setInterfaceMode(enm)}
          >
            {translator(
              enm,
              lang,
              TRANSLATE_COLLECTION.CONTROLLER,
            ).toUpperCase()}
          </div>
        ))}
      </div>
      <div className="colorblinder-controller-wrapper">
        <div className="colorblinder-controller-switch-box">
          {["HSV", "HSL"].map((name, i) => (
            <div
              className={
                "colorblinder-controller-lightness-button" +
                (colorMode === COLOR_MODE[name] ? " active" : "")
              }
              key={i}
              onClick={() => setColorMode(COLOR_MODE[name])}
            >
              {name}
            </div>
          ))}
        </div>

        <h4>
          {translator(
            CONTROLLER_CONTEXT.TITLE_CAMERA,
            lang,
            TRANSLATE_COLLECTION.CONTROLLER,
          )}
        </h4>
        <div className="colorblinder-controller-item">
          <label>
            <span>
              <span>
                {translator(
                  CONTROLLER_CONTEXT.LABEL_ELEVATION,
                  lang,
                  TRANSLATE_COLLECTION.CONTROLLER,
                )}
              </span>
              <Mouse rightOff={true} />
              <ArrowUpDown />
            </span>
            <span>{decimaling(GL.arcOffsetElevation(elevation), 1)}°</span>
          </label>
          <input
            type="range"
            min={MIN_ELEVATION}
            max={MAX_ELEVATION}
            step="1"
            value={GL.arcOffsetElevation(elevation)}
            onChange={(e) =>
              setElevation(GL.offsetElevation(e.target.valueAsNumber))
            }
          />
        </div>

        {interfaceMode === INTERFACE_MODE.SELECTOR && (
          <>
            <div className="colorblinder-controller-divider" />
            <h4>
              {translator(
                CONTROLLER_CONTEXT.TITLE_SELECTION,
                lang,
                TRANSLATE_COLLECTION.CONTROLLER,
              )}
            </h4>
          </>
        )}
        <div className="colorblinder-controller-item">
          <label>
            <span>
              <span>
                {translator(
                  (() => {
                    switch (interfaceMode) {
                      case INTERFACE_MODE.SELECTOR:
                        return CONTROLLER_CONTEXT.LABEL_HUE;
                      case INTERFACE_MODE.DISPLAYER:
                        return CONTROLLER_CONTEXT.LABEL_AZIMUTH;
                    }
                  })(),
                  lang,
                  TRANSLATE_COLLECTION.CONTROLLER,
                )}
              </span>
              <Mouse rightOff={true} />
              <ArrowLeftRight />
            </span>
            <span>{decimaling(GL.arcOffsetHue(azimuth), 1)}°</span>
          </label>
          <input
            type="range"
            min={MIN_AZIMUTH}
            max={MAX_AZIMUTH}
            step="0.1"
            value={GL.arcOffsetHue(azimuth)}
            onChange={(e) => setAzimuth(GL.offsetHue(e.target.valueAsNumber))}
          />
        </div>
        {interfaceMode === INTERFACE_MODE.SELECTOR && (
          <>
            <div className="colorblinder-controller-item">
              <label>
                <span>
                  <span>
                    {translator(
                      CONTROLLER_CONTEXT.LABEL_SATURATION,
                      lang,
                      TRANSLATE_COLLECTION.CONTROLLER,
                    )}
                  </span>
                  <Mouse leftOff={true} />
                  <ArrowLeftRight />
                </span>
                <span>{decimaling(innerRadius * 100, 1)}%</span>
              </label>
              <input
                type="range"
                min={MIN_SATURATION}
                max={MAX_RADIUS}
                step="0.005"
                value={innerRadius}
                onChange={(e) => setInnerRadius(e.target.valueAsNumber)}
              />
            </div>
            <div className="colorblinder-controller-item">
              <label>
                <span>
                  <span>
                    {translator(
                      CONTROLLER_CONTEXT.LABEL_BRIGHTNESS,
                      lang,
                      TRANSLATE_COLLECTION.CONTROLLER,
                    )}
                  </span>
                  <Mouse leftOff={true} />
                  <ArrowUpDown />
                </span>
                <span>
                  {decimaling(GL.arcOffsetBrightness(altitude) * 100, 2)}%
                </span>
              </label>
              <input
                type="range"
                min={MIN_ALTITUDE}
                max={MAX_ALTITUDE}
                step="0.005"
                value={GL.arcOffsetBrightness(altitude)}
                onChange={(e) =>
                  setAltitude(GL.offsetBrightness(e.target.valueAsNumber))
                }
              />
            </div>
          </>
        )}

        <div className="colorblinder-controller-divider" />
        <h4>
          {translator(
            CONTROLLER_CONTEXT.TITLE_CONFIG,
            lang,
            TRANSLATE_COLLECTION.CONTROLLER,
          )}
        </h4>
        <div className="colorblinder-controller-item">
          <label>
            <span>
              {translator(
                CONTROLLER_CONTEXT.LABEL_RADIUS_SCALE,
                lang,
                TRANSLATE_COLLECTION.CONTROLLER,
              )}
            </span>
            <span>{decimaling(radiusScale * 100, 0)}%</span>
          </label>
          <input
            type="range"
            min={MIN_RADIUS_SCALE}
            max={MAX_RADIUS_SCALE}
            step="0.01"
            value={radiusScale}
            onChange={(e) => setRadiusScale(e.target.valueAsNumber)}
          />
        </div>
        <div className="colorblinder-controller-item">
          <label>
            <span>
              {translator(
                CONTROLLER_CONTEXT.LABEL_HEIGHT_SCALE,
                lang,
                TRANSLATE_COLLECTION.CONTROLLER,
              )}
            </span>
            <span>
              {decimaling(GL.arcOffsetHeightScale(heightScale) * 100, 0)}%
            </span>
          </label>
          <input
            type="range"
            min={MIN_HEIGHT_SCALE}
            max={MAX_HEIGHT_SCALE}
            step="0.01"
            value={GL.arcOffsetHeightScale(heightScale)}
            onChange={(e) =>
              setHeightScale(GL.offsetHeightScale(e.target.valueAsNumber))
            }
          />
        </div>
        {interfaceMode === INTERFACE_MODE.SELECTOR && (
          <div className="colorblinder-controller-item">
            <label>
              <span>
                {translator(
                  CONTROLLER_CONTEXT.LABEL_CYLINDER_ALPHA,
                  lang,
                  TRANSLATE_COLLECTION.CONTROLLER,
                )}
              </span>
              <span>{decimaling(cylinderAlpha * 100, 0)}%</span>
            </label>
            <input
              type="range"
              min={MIN_ALPHA}
              max={MAX_ALPHA}
              step="0.01"
              value={cylinderAlpha}
              onChange={(e) => setCylinderAlpha(e.target.valueAsNumber)}
            />
          </div>
        )}
        {interfaceMode === INTERFACE_MODE.DISPLAYER && (
          <div className="colorblinder-controller-item">
            <label>
              <span>
                {translator(
                  CONTROLLER_CONTEXT.LABEL_SPHERE_RADIUS,
                  lang,
                  TRANSLATE_COLLECTION.CONTROLLER,
                )}
              </span>
              <span>{decimaling(sphereRadius * 100, 1)}%</span>
            </label>
            <input
              type="range"
              min={MIN_SPHERE_RADIUS}
              max={MAX_SPHERE_RADIUS}
              step="0.005"
              value={sphereRadius}
              onChange={(e) => setSphereRadius(e.target.valueAsNumber)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
