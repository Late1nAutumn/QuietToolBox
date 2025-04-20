import React, { useEffect, useRef, useState } from "react";
import { EDITOR_INDEX, NOTIFICATION_TYPE } from "../enum";
import { EyeSlash } from "../../svg/EyeSlash";
import { Eye } from "../../svg/Eye";
import { Edit } from "../../svg/Edit";
import { ArrowUp } from "../../svg/ArrowUp";
import { ArrowDown } from "../../svg/ArrowDown";
import { exportSvg, pathToPoints, pointsToPathD } from "../utils";
import { Trash } from "../../svg/Trash";
import { Copy } from "../../svg/Copy";
import { copyToClipboard } from "../../utils/functions";
import ModalPathDeleteConfirm from "./ModalPathDeleteConfirm";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import {
  NOTIFICATION_CONTEXT,
  PATH_MANAGER_CONTEXT,
  TRANSLATE_COLLECTION,
} from "../translation/context";

export default function PathManager({
  keyEventCallback,
  paths,
  setPaths,
  editorIndex,
  setEditorIndex,
  setModalComponent,
  setNotificationContent,
  imgSize,
  pixelColorDisplay,
}) {
  const { lang } = useGlobal();
  const pathInputRef = useRef(null);
  const editingPathBackup = useRef(null);

  const [pathError, setPathError] = useState(false);

  const onExportClick = () => {
    let str = exportSvg(paths.slice(1).reverse(), imgSize);
    console.log(`[OUTPUT]: ${str}`);

    copyToClipboard(str).then(() =>
      setNotificationContent({
        type: NOTIFICATION_TYPE.SUCCESS,
        msg: translator(
          NOTIFICATION_CONTEXT.EXPORT_SVG,
          lang,
          TRANSLATE_COLLECTION.NOTIFICATION
        ),
      })
    );
  };

  const onSaveEditClick = () => {
    if (editorIndex === EDITOR_INDEX.NEW) {
      let temp = paths.slice();
      temp.unshift({});
      setPaths(temp);
    }
    setEditorIndex(EDITOR_INDEX.IDLE);
  };
  const onCancelEditClick = () => {
    let temp = paths.slice();
    temp[editorIndex] = Object.assign({}, editingPathBackup.current);
    editingPathBackup.current = null;
    setPaths(temp);
    setEditorIndex(EDITOR_INDEX.IDLE);
  };

  const onHideClick = (i) => {
    let temp = paths.slice();
    temp[i].display = !temp[i].display;
    setPaths(temp);
  };
  const onEditClick = (i) => {
    editingPathBackup.current = Object.assign({}, paths[i]);
    setEditorIndex(i);

    if (i === EDITOR_INDEX.NEW) {
      let temp = paths.slice();
      temp[EDITOR_INDEX.NEW] = {
        display: true,
        points: [],
        closing: false,
        stroke: "#ffffff",
        fill: "transparent",
        fillEven: false,
        pointCount: 0,
      };
      setPaths(temp);
    }
  };
  const onArrowClick = (i, direct) => {
    if (i + direct < 1 || i + direct >= paths.length) return;
    let temp = paths.slice();
    [temp[i], temp[i + direct]] = [temp[i + direct], temp[i]];
    setPaths(temp);
  };
  const onPathDelete = (i) => {
    setModalComponent(
      <ModalPathDeleteConfirm
        setModalComponent={setModalComponent}
        onConfirm={() => {
          let temp = paths.slice();
          temp.splice(i, 1);
          setPaths(temp);
        }}
      />
    );
  };

  const onPathInput = (e) => {
    let newPath = e.target.value;
    let { validation, points } = pathToPoints(newPath);
    setPathError(validation);
    temp[editorIndex].points = points;
    let temp = paths.slice();
    temp[editorIndex].pointCount = validation ? points.length : "?";
    setPaths(temp);
  };
  const onPathCopy = () => {
    copyToClipboard(pathInputRef.current.value).then(() =>
      setNotificationContent({
        type: NOTIFICATION_TYPE.SUCCESS,
        msg: translator(
          NOTIFICATION_CONTEXT.EXPORT_PATH,
          lang,
          TRANSLATE_COLLECTION.NOTIFICATION
        ),
      })
    );
  };
  const onRemoveLastPoint = () => {
    if (editorIndex === EDITOR_INDEX.IDLE) return; // for hotkey
    let temp = paths.slice();
    temp[editorIndex].points.pop();
    setPaths(temp);
  };
  const onCheckClosingPath = () => {
    if (editorIndex === EDITOR_INDEX.IDLE) return; // for hotkey
    let temp = paths.slice();
    temp[editorIndex].closing = !temp[editorIndex].closing;
    setPaths(temp);
  };
  const onCopyColorToStroke = () => {
    if (editorIndex === EDITOR_INDEX.IDLE) return; // for hotkey
    let temp = paths.slice();
    temp[editorIndex].stroke = pixelColorDisplay.slice(0, 7);
    setPaths(temp);
  };
  const onCopyColorToFill = () => {
    if (editorIndex === EDITOR_INDEX.IDLE) return; // for hotkey
    let temp = paths.slice();
    temp[editorIndex].fill = pixelColorDisplay.slice(0, 7);
    setPaths(temp);
  };
  const onColorChange = (e, field) => {
    let temp = paths.slice();
    temp[editorIndex][field] = e.target.value;
    setPaths(temp);
  };
  const onCheckNoColor = (field) => {
    let temp = paths.slice();
    if (temp[editorIndex][field] === "transparent")
      temp[editorIndex][field] = "#ffffff";
    else temp[editorIndex][field] = "transparent";
    setPaths(temp);
  };
  const onFillRuleChange = () => {
    let temp = paths.slice();
    temp[editorIndex].fillEven = !temp[editorIndex].fillEven;
    setPaths(temp);
  };

  useEffect(() => {
    keyEventCallback.current["z"] = onRemoveLastPoint;
    keyEventCallback.current["v"] = onCheckClosingPath;
    keyEventCallback.current["s"] = onCopyColorToStroke;
    keyEventCallback.current["f"] = onCopyColorToFill;
    return () => {
      delete keyEventCallback.current["z"];
      delete keyEventCallback.current["v"];
    };
  }, [paths, editorIndex]);

  return (
    <div className="sketcher-pathManager">
      {(() => {
        switch (editorIndex) {
          case EDITOR_INDEX.IDLE:
            return (
              <>
                <b>-</b>&nbsp;
                <b>
                  {translator(
                    PATH_MANAGER_CONTEXT.TITLE_MANAGER,
                    lang,
                    TRANSLATE_COLLECTION.PATH_MANAGER
                  )}
                </b>
                <div className="sketcher-pathManager-tools">
                  <button onClick={() => onEditClick(EDITOR_INDEX.NEW)}>
                    +&nbsp;
                    {translator(
                      PATH_MANAGER_CONTEXT.BUTTON_NEW_PATH,
                      lang,
                      TRANSLATE_COLLECTION.PATH_MANAGER
                    )}
                  </button>
                  <button onClick={onExportClick}>
                    {translator(
                      PATH_MANAGER_CONTEXT.BUTTON_EXPORT_SVG,
                      lang,
                      TRANSLATE_COLLECTION.PATH_MANAGER
                    )}
                  </button>
                </div>
                <div className="sketcher-pathManager-paths">
                  {paths.map(({ display, stroke, fill, pointCount }, i) =>
                    i !== EDITOR_INDEX.NEW ? (
                      <div className="sketcher-pathManager-path" key={i}>
                        <span>
                          {display ? (
                            <span
                              className="sketcher-pathManager-path-eye-button"
                              onClick={() => onHideClick(i)}
                            >
                              <Eye />
                            </span>
                          ) : (
                            <span
                              className="sketcher-pathManager-path-eye-button"
                              onClick={() => onHideClick(i)}
                            >
                              <EyeSlash />
                            </span>
                          )}
                          <span
                            className="sketcher-pathManager-path-edit-button"
                            onClick={() => onEditClick(i)}
                          >
                            <Edit />
                          </span>
                          <span
                            className="sketcher-pathManager-path-sample"
                            style={{
                              borderColor: stroke,
                              backgroundColor: fill,
                            }}
                          />
                        </span>
                        <span>
                          <span>
                            {pointCount}&nbsp;
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_NODES,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                          </span>
                          <span
                            className="sketcher-pathManager-path-arrow-button"
                            onClick={() => onArrowClick(i, -1)}
                          >
                            <ArrowUp />
                          </span>
                          <span
                            className="sketcher-pathManager-path-arrow-button"
                            onClick={() => onArrowClick(i, 1)}
                          >
                            <ArrowDown />
                          </span>
                          <span
                            className="sketcher-pathManager-path-trash-button"
                            onClick={() => onPathDelete(i)}
                          >
                            <Trash />
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span key={i} />
                    )
                  )}
                </div>
              </>
            );
          case EDITOR_INDEX.NEW:
          default:
            return (
              <>
                <b>-</b>&nbsp;
                <b>
                  {translator(
                    PATH_MANAGER_CONTEXT.TITLE_EDITOR,
                    lang,
                    TRANSLATE_COLLECTION.PATH_MANAGER
                  )}
                </b>
                <div className="sketcher-pathManager-tools">
                  <button onClick={onSaveEditClick}>
                    {translator(
                      PATH_MANAGER_CONTEXT.BUTTON_SAVE,
                      lang,
                      TRANSLATE_COLLECTION.PATH_MANAGER
                    )}
                  </button>
                  <button onClick={onCancelEditClick}>
                    {translator(
                      PATH_MANAGER_CONTEXT.BUTTON_CANCEL,
                      lang,
                      TRANSLATE_COLLECTION.PATH_MANAGER
                    )}
                  </button>
                </div>
                <div>
                  <div>
                    <input
                      ref={pathInputRef}
                      placeholder={
                        translator(
                          PATH_MANAGER_CONTEXT.PLACEHOLDER_PATH_INPUT,
                          lang,
                          TRANSLATE_COLLECTION.PATH_MANAGER
                        ) + ":"
                      }
                      value={pointsToPathD(
                        paths[editorIndex].points,
                        paths[editorIndex].closing
                      )}
                      onChange={onPathInput}
                    />
                    <span
                      className="sketcher-pathManager-path-trash-button"
                      onClick={onPathCopy}
                    >
                      <Copy />
                    </span>
                  </div>
                  {pathError ? (
                    <div className="sketcher-warning">
                      {translator(
                        PATH_MANAGER_CONTEXT.WARNING_INVALID_PATH,
                        lang,
                        TRANSLATE_COLLECTION.PATH_MANAGER
                      )}
                    </div>
                  ) : (
                    <div>
                      {paths[editorIndex].points.length}&nbsp;
                      {translator(
                        PATH_MANAGER_CONTEXT.LABEL_NODES,
                        lang,
                        TRANSLATE_COLLECTION.PATH_MANAGER
                      )}
                    </div>
                  )}
                  <div>
                    <label>
                      [Z]
                      <button onClick={onRemoveLastPoint}>
                        {translator(
                          PATH_MANAGER_CONTEXT.BUTTON_REMOVE_NODE,
                          lang,
                          TRANSLATE_COLLECTION.PATH_MANAGER
                        )}
                      </button>
                    </label>
                  </div>
                  <div>
                    <label>
                      [S]
                      <button onClick={onCopyColorToStroke}>
                        {translator(
                          PATH_MANAGER_CONTEXT.BUTTON_COLOR_TO_SROKE,
                          lang,
                          TRANSLATE_COLLECTION.PATH_MANAGER
                        )}
                      </button>
                    </label>
                  </div>
                  <div>
                    <label>
                      [F]
                      <button onClick={onCopyColorToFill}>
                        {translator(
                          PATH_MANAGER_CONTEXT.BUTTON_COLOR_TO_FILL,
                          lang,
                          TRANSLATE_COLLECTION.PATH_MANAGER
                        )}
                      </button>
                    </label>
                  </div>
                  <div>
                    <label>
                      [V]
                      <input
                        type="checkbox"
                        checked={paths[editorIndex].closing}
                        onChange={onCheckClosingPath}
                      />
                      {translator(
                        PATH_MANAGER_CONTEXT.LABEL_CLOSE_PATH,
                        lang,
                        TRANSLATE_COLLECTION.PATH_MANAGER
                      )}
                    </label>
                  </div>
                  <table className="sketcher-pathManager-property">
                    <tbody>
                      <tr>
                        <td>
                          <span>
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_STROKE,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                            :
                          </span>
                        </td>
                        <td>
                          <input
                            type="color"
                            value={
                              paths[editorIndex].stroke === "transparent"
                                ? "#ffffff"
                                : paths[editorIndex].stroke
                            }
                            disabled={
                              paths[editorIndex].stroke === "transparent"
                            }
                            onChange={(e) => onColorChange(e, "stroke")}
                          />
                        </td>
                        <td>
                          <label>
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_NO_COLOR,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                            <input
                              type="checkbox"
                              checked={
                                paths[editorIndex].stroke === "transparent"
                              }
                              onChange={() => onCheckNoColor("stroke")}
                            />
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_FILL,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                            :
                          </span>
                        </td>
                        <td>
                          <input
                            type="color"
                            value={
                              paths[editorIndex].fill === "transparent"
                                ? "#ffffff"
                                : paths[editorIndex].fill
                            }
                            disabled={paths[editorIndex].fill === "transparent"}
                            onChange={(e) => onColorChange(e, "fill")}
                          />
                        </td>
                        <td>
                          <label>
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_NO_COLOR,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                            <input
                              type="checkbox"
                              checked={
                                paths[editorIndex].fill === "transparent"
                              }
                              onChange={() => onCheckNoColor("fill")}
                            />
                          </label>
                        </td>
                      </tr>
                      {paths[editorIndex].fill !== "transparent" && (
                        <tr>
                          <td>
                            {translator(
                              PATH_MANAGER_CONTEXT.LABEL_FILL_RULE,
                              lang,
                              TRANSLATE_COLLECTION.PATH_MANAGER
                            )}
                            :
                          </td>
                          <td colSpan={2}>
                            <label>
                              {translator(
                                PATH_MANAGER_CONTEXT.LABEL_EVEN_ODD,
                                lang,
                                TRANSLATE_COLLECTION.PATH_MANAGER
                              )}
                              <input
                                type="checkbox"
                                checked={paths[editorIndex].fillEven}
                                onChange={onFillRuleChange}
                              />
                            </label>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            );
        }
      })()}
    </div>
  );
}
