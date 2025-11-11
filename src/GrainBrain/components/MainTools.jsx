import React, { useEffect, useRef, useState } from "react";

import { useGlobal } from "../../context/GlobalContext";

import { RULE } from "../utils/aoe4/data";
import { BUILDING, DYNASTY, TECH, VILLAGER_STAT } from "../utils/aoe4/enum";
import {
  gatherRate,
  villagerCapacity,
  villagerSpeed,
} from "../utils/aoe4/func";
import ModalWipePattern from "./modals/ModalWipePattern";
import { UNEMPTY_AREAS } from "../utils/constants";
import {
  DATA_UNIT,
  HELP_PAGE_MODE,
  NOTIFICATION_TYPE,
  REPORT_SUBJECT,
  SAVE_MODAL_MODE,
} from "../utils/enum";
import { isClickOnFilteredElement, otherBuildImgSrc } from "../utils/func";
import { decimaling } from "../../utils/functions";
import { LOCALSTORAGE, STORE } from "../../utils/localStorage";

import { translator } from "../utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  HINT_CONTEXT,
  NOTIFICATION_CONTEXT,
  TOOLBAR_TITLE_CONTEXT,
  TOOLTIP_ICONS_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../utils/translation/context";

import ReportSubjectRow from "./ReportSubjectRow";
import ModalSaveData from "./modals/ModalSaveData";

export default function MainTools({
  mouseCoordRef,
  report,
  gridRef,
  newBuilding,
  setNewBuilding,
  setInvalidGrids,
  updateObjectList,
  setModalComponent,
  newNotification,
  setHint,
  techState,
  setTechState,
  updateAvailabilities,
  openHelpModal,
}) {
  const { lang } = useGlobal();

  const lastAddBuildingRef = useRef(null); // for continuously adding

  const [otherBuildingSize, setOtherBuildingSize] = useState(2);

  useEffect(() => {}, []);
  useEffect(() => {}, [techState]);

  useEffect(() => {
    if (newBuilding) {
      window.addEventListener("mousemove", movingNewBuilding);
      window.addEventListener("mouseup", addNewBuilding);
      window.addEventListener("mouseup", cancelAddBuilding);
      window.addEventListener("wheel", resizeNewBuilding);
    } else {
      gridRef.current.cancelAddingObject();
    }
    return () => {
      window.removeEventListener("mousemove", movingNewBuilding);
      window.removeEventListener("mouseup", addNewBuilding);
      window.removeEventListener("mouseup", cancelAddBuilding);
      window.removeEventListener("wheel", resizeNewBuilding);
    };
  }, [newBuilding]);

  const onLocalData = (mode) => {
    setModalComponent(
      <ModalSaveData
        mode={mode}
        setModalComponent={setModalComponent}
        onConfirm={(saveName) => {
          switch (mode) {
            case SAVE_MODAL_MODE.SAVE:
              if (!saveName) {
                newNotification(
                  translator(
                    NOTIFICATION_CONTEXT.SAVE_INVALID_NAME,
                    lang,
                    TRANSLATION_COLLECTION.NOTIFICATION
                  ),
                  NOTIFICATION_TYPE.ERROR
                );
                return;
              }
              let savePack =
                LOCALSTORAGE[STORE.GRAIN_BRAIN].getSaveList() || {};
              LOCALSTORAGE[STORE.GRAIN_BRAIN].saveProgess(
                gridRef.current.atlas,
                saveName
              );
              if (savePack[saveName])
                newNotification(
                  translator(
                    NOTIFICATION_CONTEXT.SAVE_OVERWRITE,
                    lang,
                    TRANSLATION_COLLECTION.NOTIFICATION
                  ),
                  NOTIFICATION_TYPE.WARN
                );
              else
                newNotification(
                  translator(
                    NOTIFICATION_CONTEXT.SAVE_SAVE,
                    lang,
                    TRANSLATION_COLLECTION.NOTIFICATION
                  )
                );
              break;
            case SAVE_MODAL_MODE.LOAD:
              gridRef.current.atlas =
                LOCALSTORAGE[STORE.GRAIN_BRAIN].getSave(saveName);
              updateObjectList();
              updateAvailabilities();
              newNotification(
                translator(
                  NOTIFICATION_CONTEXT.LOAD_SAVE,
                  lang,
                  TRANSLATION_COLLECTION.NOTIFICATION
                )
              );
              break;
          }
        }}
      />
    );
  };

  const renderNewBuilding = (x, y) => {
    let newBuildingData = gridRef.current.moveNewObject(
      Math.floor(x),
      Math.floor(y)
    );
    setNewBuilding(newBuildingData);
    setInvalidGrids(gridRef.current.invalidCoords);
  };

  const addNewBuilding = (e) => {
    if (
      e.button !== 0 ||
      isClickOnFilteredElement(e.composedPath(), UNEMPTY_AREAS)
    )
      return;

    let object = gridRef.current.newObject;
    let isWonder = object.kind === BUILDING.OTHER && object.mods?.size.x === 6; // unnecessary fun
    let isGranary = object.kind === BUILDING.GRANARY;

    gridRef.current.confirmAddingObject(
      () => {
        if (isWonder)
          newNotification(
            translator(
              NOTIFICATION_CONTEXT.BUILD_WONDER,
              lang,
              TRANSLATION_COLLECTION.NOTIFICATION
            )
          );
        if (
          isGranary &&
          gridRef.current.getObjectCountByKind(BUILDING.GRANARY) >
            RULE.GRANARY_LIMIT
        )
          newNotification(
            translator(
              NOTIFICATION_CONTEXT.BUILD_GRANARY_LIMIT,
              lang,
              TRANSLATION_COLLECTION.NOTIFICATION
            ),
            NOTIFICATION_TYPE.WARN
          );
        onStartAddBuilding(lastAddBuildingRef.current);
        updateObjectList();
        updateAvailabilities();
      },
      () => {
        newNotification(
          translator(
            NOTIFICATION_CONTEXT.BUILD_INVALID_POSITION,
            lang,
            TRANSLATION_COLLECTION.NOTIFICATION
          ),
          NOTIFICATION_TYPE.ERROR
        );
      }
    );
  };
  const cancelAddBuilding = (e) => {
    if (e.button !== 2) return;
    setNewBuilding(null);
    setInvalidGrids([]);
    setHint("");
  };
  const movingNewBuilding = (e) => {
    if (!newBuilding) return;
    let { x, y } = gridRef.current.getCoordByPosition(e.clientX, e.clientY);
    renderNewBuilding(x, y);
  };
  const resizeNewBuilding = (e) => {
    if (!newBuilding) return;
    let { x, y } = gridRef.current.getCoordByPosition(
      mouseCoordRef.current.mouseX,
      mouseCoordRef.current.mouseY
    );
    renderNewBuilding(x, y);
  };

  const onWipePattern = () => {
    setModalComponent(
      <ModalWipePattern
        setModalComponent={setModalComponent}
        onConfirm={() => {
          gridRef.current.removeAllObject();
          updateObjectList();
          updateAvailabilities();
        }}
      />
    );
  };
  const onStartAddBuilding = (kind) => {
    let mods = {};
    if (kind === BUILDING.OTHER)
      mods.size = { x: otherBuildingSize, y: otherBuildingSize };
    lastAddBuildingRef.current = kind;
    let newBuildingData = gridRef.current.startAddingObject(
      kind,
      mods,
      mouseCoordRef.current?.mouseX,
      mouseCoordRef.current?.mouseY
    );
    setNewBuilding(newBuildingData);
    setInvalidGrids(gridRef.current.invalidCoords);
    setHint(
      translator(HINT_CONTEXT.BUILDING_HINT, lang, TRANSLATION_COLLECTION.HINT)
    );
  };
  const onOtherBuildingSizeChange = (e) => {
    setOtherBuildingSize(Number(e.target.value));
  };

  const onDynastyCountChange = (e) => {
    let temp = { ...techState };
    temp[TECH.DYNASTY_COUNT] = Number(e.target.value);
    setTechState(temp);
  };
  const toggleTech = (tech) => {
    let temp = { ...techState };
    switch (tech) {
      case TECH.HORTICULTURE:
      case TECH.FERTILIZATION:
      case TECH.CROSSBREEDING:
        temp[TECH.FOOD_GATHER] = temp[TECH.FOOD_GATHER] === tech ? 0 : tech;
        break;
      case TECH.WHEELBARROW:
      case TECH.ANCIENTTECH:
        temp[tech] = !temp[tech];
        break;
    }
    setTechState(temp);
  };
  const switchDynasty = (dynasty) => {
    let temp = { ...techState };
    temp[TECH.DYNASTY] =
      temp[TECH.DYNASTY] === dynasty ? DYNASTY.TANG : dynasty;
    setTechState(temp);
  };

  const techIconClassName = (tech) => {
    let baseName = "grainbrain-toolbar-techicon grainbrain-aoeicon-tech";
    let active = false;
    switch (tech) {
      case TECH.HORTICULTURE:
      case TECH.FERTILIZATION:
      case TECH.CROSSBREEDING:
        active = techState[TECH.FOOD_GATHER] >= tech;
        break;
      case TECH.ANCIENTTECH:
      case TECH.WHEELBARROW:
      default:
        active = techState[tech];
        break;
    }
    return baseName + (active ? "" : " grainbrain-inactive");
  };
  const dynastyIconClassName = (dynasty) => {
    return (
      "grainbrain-toolbar-techicon grainbrain-toolbar-dynastyicon" +
      (techState[TECH.DYNASTY] === dynasty ? "" : " grainbrain-inactive")
    );
  };

  let granaryCount = gridRef.current.getObjectCountByKind(BUILDING.GRANARY);

  return (
    <div className="grainbrain-toolbar-content">
      <div>
        <div className="grainbrain-toolbar-profile">
          <button onClick={() => onLocalData(SAVE_MODAL_MODE.SAVE)}>
            {translator(
              APP_MISC_CONTEXT.BUTTON_SAVE,
              lang,
              TRANSLATION_COLLECTION.APP_MISC
            )}
          </button>
          <button onClick={() => onLocalData(SAVE_MODAL_MODE.LOAD)}>
            {translator(
              APP_MISC_CONTEXT.BUTTON_IMPORT,
              lang,
              TRANSLATION_COLLECTION.APP_MISC
            )}
          </button>
        </div>
      </div>
      <div>
        <div className="grainbrain-toolbar-title">
          <h2>
            {translator(
              TOOLBAR_TITLE_CONTEXT.SUMMARY,
              lang,
              TRANSLATION_COLLECTION.TOOLBAR_TITLE
            )}
          </h2>
          <img
            src="./asset/aoe4/research.png"
            onClick={() => openHelpModal(HELP_PAGE_MODE.STATISTICS)}
            title={translator(
              TOOLTIP_ICONS_CONTEXT.BOOK,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_ICONS
            )}
            alt="research_icon"
          />
        </div>
        <table>
          <tbody>
            {[
              REPORT_SUBJECT.TOTAL_RATE,
              REPORT_SUBJECT.AVERAGE_RATE,
              REPORT_SUBJECT.CHUNKS_BUFFED,
              REPORT_SUBJECT.TRIPLE_BUFFED,
              REPORT_SUBJECT.DOUBLE_BUFFED,
              REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK,
              REPORT_SUBJECT.AVERAGE_MOVE_DURATION,
              REPORT_SUBJECT.AVERAGE_MOVE_RATIO,
            ].map((subject, i) => (
              <ReportSubjectRow report={report} subject={subject} key={i} />
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="grainbrain-toolbar-title">
          <h2>
            {translator(
              TOOLBAR_TITLE_CONTEXT.BUILDING,
              lang,
              TRANSLATION_COLLECTION.TOOLBAR_TITLE
            )}
          </h2>
          <img
            onClick={onWipePattern}
            src="./asset/aoe4/delete.png"
            title={translator(
              TOOLTIP_ICONS_CONTEXT.DELETE_ALL,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_ICONS
            )}
            alt="delete_icon"
          />
        </div>
        <div className="grainbrain-toolbar-subject">
          <span
            className={
              "grainbrain-toolbar-subject-building" +
              (granaryCount > RULE.GRANARY_LIMIT ? " grainbrain-warn-text" : "")
            }
          >
            <span className="grainbrain-toolbar-subject-buildingname">
              {translator(
                BUILDING.GRANARY,
                lang,
                TRANSLATION_COLLECTION.BUILDING_NAME
              )}
            </span>
            <span>{granaryCount}&nbsp;/ 3</span>
          </span>
          <span
            className="grainbrain-toolbar-buildingicon grainbrain-aoeicon-eco"
            onClick={() => onStartAddBuilding(BUILDING.GRANARY)}
            title={translator(
              BUILDING.GRANARY,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_BUILDING
            )}
          >
            <img src="./asset/aoe4/granary.png" alt="build_icon" />
          </span>
          <span
            className="grainbrain-toolbar-iconbutton"
            onClick={() => onStartAddBuilding(BUILDING.GRANARY)}
          >
            <img src="./asset/aoe4/repair.png" alt="building_icon" />
          </span>
        </div>
        <div className="grainbrain-toolbar-subject">
          <span className="grainbrain-toolbar-subject-building">
            <span className="grainbrain-toolbar-subject-buildingname">
              {translator(
                BUILDING.FARM,
                lang,
                TRANSLATION_COLLECTION.BUILDING_NAME
              )}
            </span>
            <span>{gridRef.current.getObjectCountByKind(BUILDING.FARM)}</span>
          </span>
          <span
            className="grainbrain-toolbar-buildingicon grainbrain-aoeicon-eco"
            onClick={() => onStartAddBuilding(BUILDING.FARM)}
            title={translator(
              BUILDING.FARM,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_BUILDING
            )}
          >
            <img src="./asset/aoe4/farm.png" alt="building_icon" />
          </span>
          <span
            className="grainbrain-toolbar-iconbutton"
            onClick={() => onStartAddBuilding(BUILDING.FARM)}
          >
            <img src="./asset/aoe4/repair.png" alt="build_icon" />
          </span>
        </div>
        <div className="grainbrain-toolbar-subject">
          <span className="grainbrain-toolbar-subject-building">
            {translator(
              BUILDING.MILL,
              lang,
              TRANSLATION_COLLECTION.BUILDING_NAME
            )}
          </span>
          <span
            className="grainbrain-toolbar-buildingicon grainbrain-aoeicon-eco"
            onClick={() => onStartAddBuilding(BUILDING.MILL)}
            title={translator(
              BUILDING.MILL,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_BUILDING
            )}
          >
            <img src="./asset/aoe4/mill.png" alt="building_icon" />
          </span>
          <span
            className="grainbrain-toolbar-iconbutton"
            onClick={() => onStartAddBuilding(BUILDING.MILL)}
          >
            <img src="./asset/aoe4/repair.png" alt="build_icon" />
          </span>
        </div>
        <div className="grainbrain-toolbar-subject">
          <span className="grainbrain-toolbar-subject-building">
            {translator(
              BUILDING.OTHER,
              lang,
              TRANSLATION_COLLECTION.BUILDING_NAME
            )}
          </span>
          <select
            value={otherBuildingSize}
            onChange={onOtherBuildingSizeChange}
          >
            <option value={2}>2 × 2</option>
            <option value={3}>3 × 3</option>
            <option value={4}>4 × 4</option>
            <option value={6}>6 × 6</option>
          </select>
          <span
            className="grainbrain-toolbar-buildingicon grainbrain-aoeicon-military"
            onClick={() => onStartAddBuilding(BUILDING.OTHER)}
          >
            <img
              src={otherBuildImgSrc(otherBuildingSize)}
              alt="building_icon"
            />
          </span>
          <span
            className="grainbrain-toolbar-iconbutton"
            onClick={() => onStartAddBuilding(BUILDING.OTHER)}
          >
            <img src="./asset/aoe4/repair.png" alt="build_icon" />
          </span>
        </div>
      </div>
      <div>
        <div className="grainbrain-toolbar-title">
          <h2>
            {translator(
              TOOLBAR_TITLE_CONTEXT.TECH,
              lang,
              TRANSLATION_COLLECTION.TOOLBAR_TITLE
            )}
          </h2>
        </div>
        <div className="grainbrain-toolbar-subject">
          <span
            className={techIconClassName(TECH.HORTICULTURE)}
            onClick={() => toggleTech(TECH.HORTICULTURE)}
            title={translator(
              TECH.HORTICULTURE,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_TECH
            )}
          >
            <img src="./asset/aoe4/horticulture.png" alt="tech_icon" />
          </span>
          <span
            className={techIconClassName(TECH.FERTILIZATION)}
            onClick={() => toggleTech(TECH.FERTILIZATION)}
            title={translator(
              TECH.FERTILIZATION,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_TECH
            )}
          >
            <img src="./asset/aoe4/fertilization.png" alt="tech_icon" />
          </span>
          <span
            className={techIconClassName(TECH.CROSSBREEDING)}
            onClick={() => toggleTech(TECH.CROSSBREEDING)}
            title={translator(
              TECH.CROSSBREEDING,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_TECH
            )}
          >
            <img
              src="./asset/aoe4/precision-cross-breeding.png"
              alt="tech_icon"
            />
          </span>
        </div>
        <div className="grainbrain-toolbar-subject">
          <span
            className={techIconClassName(TECH.ANCIENTTECH)}
            onClick={() => toggleTech(TECH.ANCIENTTECH)}
            title={translator(
              TECH.ANCIENTTECH,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_TECH
            )}
          >
            <img src="./asset/aoe4/ancient-techniques.png" alt="tech_icon" />
          </span>
          {techState[TECH.ANCIENTTECH] && (
            <select
              value={techState[TECH.DYNASTY_COUNT]}
              onChange={onDynastyCountChange}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="grainbrain-toolbar-subject">
          <span
            className={techIconClassName(TECH.WHEELBARROW)}
            onClick={() => toggleTech(TECH.WHEELBARROW)}
            title={translator(
              TECH.WHEELBARROW,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_TECH
            )}
          >
            <img src="./asset/aoe4/wheelbarrow.png" alt="tech_icon" />
          </span>
          <span
            className={dynastyIconClassName(DYNASTY.YUAN)}
            onClick={() => switchDynasty(DYNASTY.YUAN)}
            title={translator(
              DYNASTY.YUAN,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_DYNASTY
            )}
          >
            <img src="./asset/aoe4/yuan.png" alt="tech_icon" />
          </span>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="grainbrain-toolbar-subject-fieldname">
                {translator(
                  VILLAGER_STAT.GATHER_RATE,
                  lang,
                  TRANSLATION_COLLECTION.FARMER_STAT
                )}
                :
              </td>
              <td className="grainbrain-toolbar-subject-fieldvalue">
                {decimaling(
                  gatherRate(
                    techState[TECH.FOOD_GATHER] - TECH.FOOD_GATHER,
                    +techState[TECH.ANCIENTTECH] *
                      techState[TECH.DYNASTY_COUNT],
                    0
                  ),
                  4
                )}
                &nbsp;
                {translator(
                  DATA_UNIT.PER_SECOND,
                  lang,
                  TRANSLATION_COLLECTION.DATA_UNIT_NAME
                )}
              </td>
            </tr>
            <tr>
              <td className="grainbrain-toolbar-subject-fieldname">
                {translator(
                  VILLAGER_STAT.MOVE_SPEED,
                  lang,
                  TRANSLATION_COLLECTION.FARMER_STAT
                )}
                :
              </td>
              <td className="grainbrain-toolbar-subject-fieldvalue">
                {decimaling(
                  villagerSpeed(
                    techState[TECH.WHEELBARROW],
                    techState[TECH.DYNASTY]
                  ),
                  5
                )}
                &nbsp;
                {translator(
                  DATA_UNIT.TILE_PER_SECOND,
                  lang,
                  TRANSLATION_COLLECTION.DATA_UNIT_NAME
                )}
              </td>
            </tr>
            <tr>
              <td className="grainbrain-toolbar-subject-fieldname">
                {translator(
                  VILLAGER_STAT.CAPACITY,
                  lang,
                  TRANSLATION_COLLECTION.FARMER_STAT
                )}
                :
              </td>
              <td className="grainbrain-toolbar-subject-fieldvalue">
                {villagerCapacity(techState[TECH.WHEELBARROW])}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
