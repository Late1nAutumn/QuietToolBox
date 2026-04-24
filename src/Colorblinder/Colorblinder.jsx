import React, { useState, useEffect, useRef } from "react";
import { GL } from "./graphics";
import {
  COLOR_MODE,
  DEFAULT_ALPHA,
  DEFAULT_ALTITUDE,
  DEFAULT_AZIMUTH,
  DEFAULT_COLOR_LIST,
  DEFAULT_ELEVATION,
  DEFAULT_HEIGHT_SCALE,
  DEFAULT_RADIUS,
  DEFAULT_RADIUS_SCALE,
  DEFAULT_SPHERE_RADIUS,
  INTERFACE_MODE,
  MIN_RADIUS,
} from "./constants";
import Palette from "./conponents/Palette";
import Roster from "./conponents/Roster";
import Controller from "./conponents/Controller";
import NexusButton from "../Home/NexusButton/NexusButton";
import { DIRECTION } from "../utils/enums";
import { APP, APPS } from "../utils/constants";
import { setFavicon } from "../utils/functions";

export default function Colorblinder() {
  const glRef = useRef(new GL());
  const canvasRef = useRef(null);
  const paletteRef = useRef(null);

  // modes
  const [interfaceMode, setInterfaceMode] = useState(INTERFACE_MODE.SELECTOR);
  const [colorMode, setColorMode] = useState(COLOR_MODE.HSV);

  // camera
  const [elevation, setElevation] = useState(
    GL.offsetElevation(DEFAULT_ELEVATION),
  ); // deg

  // user input
  const [azimuth, setAzimuth] = useState(GL.offsetHue(DEFAULT_AZIMUTH)); // deg
  const [innerRadius, setInnerRadius] = useState(DEFAULT_RADIUS);
  const [altitude, setAltitude] = useState(
    GL.offsetBrightness(DEFAULT_ALTITUDE),
  );
  const [displayedColors, setDisplayedColors] = useState(DEFAULT_COLOR_LIST); // { visible,r,g,b }

  // display config
  const [radiusScale, setRadiusScale] = useState(DEFAULT_RADIUS_SCALE);
  const [heightScale, setHeightScale] = useState(
    GL.offsetHeightScale(DEFAULT_HEIGHT_SCALE),
  );
  const [cylinderAlpha, setCylinderAlpha] = useState(DEFAULT_ALPHA);
  const [sphereRadius, setSphereRadius] = useState(DEFAULT_SPHERE_RADIUS);

  function mapParam() {
    let params = {
      canvasRef,
      paletteRef,

      interfaceMode,
      colorMode,
      elevation,
      azimuth,
      innerRadius,
      radiusScale,
      altitude,
      heightScale,
      cylinderAlpha,
      sphereRadius,
      displayedColors,
    };
    if (interfaceMode === INTERFACE_MODE.DISPLAYER) {
      params.innerRadius = MIN_RADIUS;
      params.cylinderAlpha = 1;
    }
    return params;
  }
  function onResize() {
    resizeHandlerRef.current();
  }

  const resizeHandlerRef = useRef(() => {});
  useEffect(() => {
    resizeHandlerRef.current = () => {
      if (!glRef.current.ready) return;
      glRef.current.onWindowResize(mapParam());
      glRef.current.render(mapParam());
    };
  });

  useEffect(() => {
    document.title = APPS[APP.COLORBLINDER].text;
    setFavicon(APPS[APP.COLORBLINDER].favicon);
    try {
      glRef.current.init(mapParam());
      window.addEventListener("resize", onResize);
    } catch (e) {
      let { desc, msg } = e;
      if (desc) {
        alert("Render Error!!!: " + desc);
        console.log(desc);
        if (msg) console.error(msg);
      } else {
        alert("Render Error!!! Please check the console");
      }
      console.error(e);
    }
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // #region Canvas rerender
  useEffect(() => {
    if (!glRef.current.ready) return;
    glRef.current.recalculate(mapParam());
    glRef.current.render(mapParam());
  }, [
    interfaceMode,
    colorMode,
    elevation,
    cylinderAlpha,
    azimuth,
    innerRadius,
    altitude,
    radiusScale,
    heightScale,
    sphereRadius,
    displayedColors,
  ]);
  // #endregion

  function updateSelection({ innerRadius, altitude, azimuth }) {
    setInnerRadius(innerRadius);
    setAltitude(altitude);
    setAzimuth(azimuth);
  }

  return (
    <div className="colorblinder">
      <span className="colorblinder-nexus">
        <NexusButton menuDirection={DIRECTION.LEFT} />
      </span>

      <canvas ref={canvasRef} />

      <Controller
        canvasRef={canvasRef}
        interfaceMode={interfaceMode}
        setInterfaceMode={setInterfaceMode}
        colorMode={colorMode}
        setColorMode={setColorMode}
        elevation={elevation}
        setElevation={setElevation}
        azimuth={azimuth}
        setAzimuth={setAzimuth}
        innerRadius={innerRadius}
        setInnerRadius={setInnerRadius}
        radiusScale={radiusScale}
        setRadiusScale={setRadiusScale}
        altitude={altitude}
        setAltitude={setAltitude}
        heightScale={heightScale}
        setHeightScale={setHeightScale}
        cylinderAlpha={cylinderAlpha}
        setCylinderAlpha={setCylinderAlpha}
        sphereRadius={sphereRadius}
        setSphereRadius={setSphereRadius}
      />

      {interfaceMode === INTERFACE_MODE.SELECTOR && (
        <Palette
          paletteRef={paletteRef}
          colorMode={colorMode}
          azimuth={azimuth}
          innerRadius={innerRadius}
          altitude={altitude}
          updateSelection={updateSelection}
        />
      )}
      {interfaceMode === INTERFACE_MODE.DISPLAYER && (
        <Roster
          displayedColors={displayedColors}
          setDisplayedColors={setDisplayedColors}
        />
      )}
    </div>
  );
}
