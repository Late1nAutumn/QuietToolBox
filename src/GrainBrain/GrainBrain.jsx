import React, { useEffect, useRef, useState } from "react";

import Grider from "./utils/grider";
import { useGlobal } from "../context/GlobalContext";

import { AOE_VERSION } from "./utils/aoe4/data";
import { BUILDING, DYNASTY, TECH } from "./utils/aoe4/enum";
import {
  DEFAULT_PATTERN,
  UNEMPTY_AREAS,
  GRID_ROSTER,
  UNZOOMABLE_AREAS,
  ZOOM_PERCENT,
  TOOLBAR_WIDTH,
} from "./utils/constants";
import { HELP_PAGE_MODE } from "./utils/enum";
import {
  autoFillAvailable,
  generateReport,
  generateTracker,
  isClickOnFilteredElement,
} from "./utils/func";

import { APP, APPS } from "../utils/constants";
import { DIRECTION } from "../utils/enums";
import { preventDefault, setFavicon } from "../utils/functions";
import { LOCALSTORAGE, STORE } from "../utils/localStorage";

import { translator } from "./utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  HINT_CONTEXT,
  TRANSLATION_COLLECTION,
} from "./utils/translation/context";

import MainTools from "./components/MainTools";
import ObjectTools from "./components/ObjectTools";
import NexusButton from "../Home/NexusButton/NexusButton";
import AtlasObject from "./components/AtlasObject";
import Footer from "./components/Footer";
import Modal from "../components/Modal";
import ModalHelp from "./components/modals/ModalHelp";
import Notification from "./components/Notification";

export default function GrainBrain() {
  const { lang } = useGlobal();

  const gridRef = useRef(
    new Grider(
      GRID_ROSTER,
      LOCALSTORAGE[STORE.GRAIN_BRAIN].loadAutoSave() || DEFAULT_PATTERN
    )
  );

  const dragingCameraRef = useRef(false);
  const mouseCoordRef = useRef({
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
  });
  const notificationList = useRef([]);

  const [objectList, setObjectList] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [tracker, setTracker] = useState(null);
  const [techState, setTechState] = useState({
    [TECH.DYNASTY]: DYNASTY.TANG,
    [TECH.DYNASTY_COUNT]: 4,
    [TECH.FOOD_GATHER]: TECH.FOOD_GATHER,
    [TECH.WHEELBARROW]: false,
    [TECH.ANCIENTTECH]: false,
  });
  const [report, setReport] = useState(null);

  const [newBuilding, setNewBuilding] = useState(null);
  const [invalidGrids, setInvalidGrids] = useState([]);

  const [autoFillable, setAutoFillable] = useState(false);
  const [displayGrid, setDisplayGrid] = useState(true);
  const [displayGuidelines, setDisplayGuidelines] = useState(true);
  const [modalComponent, setModalComponent] = useState(null);
  const [notificationDisplay, setNotificationDisplay] = useState([]);
  const [hint, setHint] = useState("");

  const updateObjectList = () => {
    setObjectList(gridRef.current.getVisibleObjectList());
  };
  const updateTracker = () =>
    setTracker(generateTracker(gridRef.current.atlas, techState));
  const updateAutoFillable = () =>
    setAutoFillable(autoFillAvailable(gridRef.current.atlas));
  const updateReport = () =>
    setReport(generateReport(tracker, gridRef.current.atlas, techState));
  const updateAvailabilities = () => {
    updateTracker();
    updateAutoFillable();
  };

  const newNotification = (msg, type) => {
    notificationList.current = notificationList.current.slice();
    notificationList.current.push({ type, msg, id: crypto.randomUUID() });
    setNotificationDisplay(notificationList.current);
  };
  const removeLastNotification = () => {
    notificationList.current = notificationList.current.slice();
    notificationList.current.shift();
    setNotificationDisplay(notificationList.current);
  };

  // #region mouse events
  const cancelBuildingSelect = (e) => {
    if (
      e.button !== 0 ||
      isClickOnFilteredElement(e.composedPath(), UNEMPTY_AREAS)
    )
      return;
    setSelectedObject(null);
  };
  const dragStart = (e) => {
    if (e.button !== 2) return;
    dragingCameraRef.current = true;
  };
  const dragEnd = (e) => {
    if (e.button !== 2) return;
    dragingCameraRef.current = false;
  };
  const draging = (e) => {
    mouseCoordRef.current = { mouseX: e.clientX, mouseY: e.clientY };
    if (!dragingCameraRef.current) return;
    gridRef.current.moveCamera(e.movementX, e.movementY, () => {
      setObjectList(gridRef.current.getVisibleObjectList());
    });
  };
  const zoomCamera = (e) => {
    if (isClickOnFilteredElement(e.composedPath(), UNZOOMABLE_AREAS)) return;
    gridRef.current.zoomCamera(
      (100 - Math.sign(e.deltaY) * ZOOM_PERCENT) / 100,
      mouseCoordRef.current.mouseX,
      mouseCoordRef.current.mouseY,
      updateObjectList
    );
  };
  // #endregion

  const autoCamera = () => {
    gridRef.current.autoCamera(
      0,
      TOOLBAR_WIDTH,
      window.innerHeight,
      window.innerWidth - TOOLBAR_WIDTH
    );
    updateObjectList();
  };

  const openHelpModal = (initContent) => {
    setModalComponent(
      <ModalHelp
        initContent={initContent}
        setModalComponent={setModalComponent}
      />
    );
  };

  useEffect(() => {
    document.title = APPS[APP.GRAIN_GRAIN].text;
    setFavicon(APPS[APP.GRAIN_GRAIN].favicon);

    autoCamera();
    // updateObjectList();
    updateAvailabilities();

    // show help page on first run
    if (LOCALSTORAGE[STORE.GRAIN_BRAIN].loadAutoSave() === null)
      openHelpModal(HELP_PAGE_MODE.STATISTICS);
    setHint(
      translator(HINT_CONTEXT.DEFAULT_HINT, lang, TRANSLATION_COLLECTION.HINT)
    );
    // TODO: window resize handle
    window.addEventListener("mousedown", dragStart);
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("mouseup", cancelBuildingSelect);
    window.addEventListener("mousemove", draging);
    window.addEventListener("blur", dragEnd);
    window.addEventListener("wheel", zoomCamera);
    window.addEventListener("contextmenu", preventDefault);
    console.log("[info]: Run debug() to check auto save data");
    window.debug = () =>
      JSON.stringify(LOCALSTORAGE[STORE.GRAIN_BRAIN].loadAutoSave());
    return () => {
      window.removeEventListener("mousedown", dragStart);
      window.removeEventListener("mouseup", dragEnd);
      window.removeEventListener("mouseup", cancelBuildingSelect);
      window.removeEventListener("mousemove", draging);
      window.removeEventListener("blur", dragEnd);
      window.removeEventListener("wheel", zoomCamera);
      window.removeEventListener("contextmenu", preventDefault);
      delete window.debug;
    };
  }, []);

  useEffect(() => {
    updateTracker();
  }, [techState]);
  useEffect(() => {
    updateReport();
  }, [tracker]);
  useEffect(() => {
    if (Object.keys(gridRef.current.atlas).length)
      LOCALSTORAGE[STORE.GRAIN_BRAIN].autoSave(gridRef.current.atlas);
  }, [report]);

  useEffect(() => {
    if (!modalComponent) return;
    setNewBuilding(null);
    setInvalidGrids([]);
    setHint("");
  }, [modalComponent]);

  const onBuildingSelect = (uuid) => {
    if (newBuilding) return;
    setSelectedObject(uuid);
    setHint("");
  };

  const toggleGrid = () => setDisplayGrid(!displayGrid);
  const toggleGuideline = () => setDisplayGuidelines(!displayGuidelines);

  const netStyle = () => {
    let size = gridRef.current.camera.zoom;
    let { x, y } = gridRef.current.getGridLineOffset();
    return {
      backgroundPosition: `${x}px ${y}px`,
      backgroundSize: `${size}px ${size}px`,
    };
  };

  return (
    <div className="grainbrain untouchable">
      {modalComponent && <Modal component={modalComponent} />}
      <div className="grainbrain-notifications">
        <div className="grainbrain-notifications-container">
          {notificationDisplay.map((data, i) => (
            <Notification
              data={data}
              index={notificationDisplay.length - i - 1}
              key={data.id}
              removeLastNotification={removeLastNotification}
            />
          ))}
        </div>
      </div>
      {hint && <div className="grainbrain-hint">{hint}</div>}
      <div className="grainbrain-toolbar">
        <div className="grainbrain-header">
          <div className="grainbrain-nexus">
            <NexusButton menuDirection={DIRECTION.RIGHT} />
          </div>
          <div className="grainbrain-header-title">
            {translator(
              APP_MISC_CONTEXT.APP_TITLE,
              lang,
              TRANSLATION_COLLECTION.APP_MISC
            )}
          </div>
          <div className="grainbrain-header-version">
            AoE4 version: {AOE_VERSION}
          </div>
        </div>
        {selectedObject ? (
          <ObjectTools
            uuid={selectedObject}
            report={report?.buildings?.[selectedObject]}
            gridRef={gridRef}
            setSelectedObject={setSelectedObject}
            updateObjectList={updateObjectList}
            updateAvailabilities={updateAvailabilities}
            openHelpModal={openHelpModal}
          />
        ) : (
          <MainTools
            mouseCoordRef={mouseCoordRef}
            report={report?.overview}
            gridRef={gridRef}
            newBuilding={newBuilding}
            setNewBuilding={setNewBuilding}
            setInvalidGrids={setInvalidGrids}
            setModalComponent={setModalComponent}
            setHint={setHint}
            techState={techState}
            setTechState={setTechState}
            updateObjectList={updateObjectList}
            updateAvailabilities={updateAvailabilities}
            newNotification={newNotification}
            openHelpModal={openHelpModal}
          />
        )}
      </div>
      <Footer
        gridRef={gridRef}
        autoFillable={autoFillable}
        displayGrid={displayGrid}
        toggleGrid={toggleGrid}
        displayGuidelines={displayGuidelines}
        toggleGuideline={toggleGuideline}
        autoCamera={autoCamera}
        updateObjectList={updateObjectList}
        updateAvailabilities={updateAvailabilities}
        newNotification={newNotification}
        openHelpModal={openHelpModal}
      />
      <div className="grainbrain-view">
        {objectList.map((data, i) => (
          <AtlasObject
            blurred={
              selectedObject &&
              selectedObject !== data.uuid &&
              selectedObject !== tracker[data.uuid]?.dropper &&
              data.uuid !== tracker[selectedObject]?.dropper &&
              !tracker[data.uuid]?.buffedBy?.find((list) =>
                list.includes(selectedObject)
              ) &&
              !tracker[selectedObject]?.buffedBy?.find((list) =>
                list.includes(data.uuid)
              )
            }
            lowlighted={data.uuid === tracker[selectedObject]?.dropper}
            highlighted={selectedObject && selectedObject === data.uuid}
            displayGuidelines={displayGuidelines}
            data={data}
            tracker={tracker}
            onBuildingSelect={onBuildingSelect}
            key={i}
          />
        ))}
        {newBuilding && (
          <AtlasObject
            blurred={true}
            displayGuidelines={newBuilding.kind === BUILDING.GRANARY}
            data={newBuilding}
            onBuildingSelect={onBuildingSelect}
          />
        )}
        {invalidGrids.map(({ left, top, width, height }, i) => (
          <div
            className="grainbrain-view-invalid-cell"
            style={{ left, top, width, height }}
            key={i}
          />
        ))}
      </div>
      {displayGrid && (
        <div className="grainbrain-gridLayer" style={netStyle()} />
      )}
    </div>
  );
}
