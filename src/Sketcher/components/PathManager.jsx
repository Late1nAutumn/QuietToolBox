import React, { useEffect, useRef, useState } from "react";
import { EDITOR_INDEX } from "../enum";
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

export default function PathManager({
  keyEventCallback,
  paths,
  setPaths,
  editorIndex,
  setEditorIndex,
  setModalComponent,
  setNotificationContent,
  imgSize,
}) {
  const pathInputRef = useRef(null);
  const editingPathBackup = useRef(null);

  const [pathError, setPathError] = useState(false);

  const onExportClick = () => {
    let str = exportSvg(paths.slice(1).reverse(), imgSize);
    console.log(`[OUTPUT]: ${str}`);

    copyToClipboard(str).then(() =>
      setNotificationContent("Svg data copied!")
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
          setModalComponent(null);
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
      setNotificationContent("Path data copied!")
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
                <b>-</b>&nbsp;<b>Paths</b>
                <div className="sketcher-pathManager-tools">
                  <button onClick={() => onEditClick(EDITOR_INDEX.NEW)}>
                    + New
                  </button>
                  <button onClick={onExportClick}>Export</button>
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
                          <span>{pointCount} nodes</span>
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
                <b>-</b>&nbsp;<b>Edit Path</b>
                <div className="sketcher-pathManager-tools">
                  <button onClick={onSaveEditClick}>Save</button>
                  <button onClick={onCancelEditClick}>Cancel</button>
                </div>
                <div>
                  <div>
                    <input
                      ref={pathInputRef}
                      placeholder="Paste path here"
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
                      Invalid path. Features might fail
                    </div>
                  ) : (
                    <div>{paths[editorIndex].points.length} nodes</div>
                  )}
                  <div>
                    <label>
                      [Z]
                      <button onClick={onRemoveLastPoint}>
                        Remove last node
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
                      Closing path
                    </label>
                  </div>
                  <table className="sketcher-pathManager-property">
                    <tbody>
                      <tr>
                        <td>
                          <span>Stroke:</span>
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
                            none
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
                          <span>Fill:</span>
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
                            none
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
                          <td>Fill rule:</td>
                          <td colSpan={2}>
                            <label>
                              Even-odd
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
