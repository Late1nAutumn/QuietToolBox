import React from "react";

import { CALCULATED, RULE } from "../utils/aoe4/data";
import { BUILDING } from "../utils/aoe4/enum";
import { otherBuildImgSrc } from "../utils/func";

export default function AtlasObject({
  blurred,
  lowlighted,
  highlighted,
  displayGuidelines,
  data,
  tracker,
  onBuildingSelect,
}) {
  let { uuid, kind, position, area, mods, coord, size } = data;

  const isChunkBuffed = (i) => tracker?.[uuid]?.chunkBuffs[i] > 0;
  const isChunkUsed = (i) =>
    tracker?.[uuid]?.activeChunks.map(({ index }) => index).includes(i);

  const guidelines = () => (
    <>
      {kind === BUILDING.FARM && (
        <div
          className="grainbrain-object-guideline-farmchunks"
          style={{
            top: `${CALCULATED.FARM_PADDING_PERCENT}%`,
            left: `${CALCULATED.FARM_PADDING_PERCENT}%`,
            width: `${CALCULATED.FARM_WIDTH_PERCENT}%`,
            height: `${CALCULATED.FARM_WIDTH_PERCENT}%`,
            gridTemplateColumns: `repeat(${RULE.FARM_CHUNK}, 1fr)`,
            gridTemplateRows: `repeat(${RULE.FARM_CHUNK}, 1fr)`,
          }}
        >
          {new Array(RULE.FARM_CHUNK ** 2).fill().map((_, i) => (
            <div
              className={
                "grainbrain-object-guideline-farmchunk" +
                (isChunkBuffed(i)
                  ? " grainbrain-object-buffed-chunk"
                  : " grainbrain-object-unbuffed-chunk")
              }
              key={i}
            >
              <div
                className={
                  isChunkUsed(i)
                    ? "grainbrain-object-active-indicator"
                    : "grainbrain-object-inactive-indicator"
                }
              />
            </div>
          ))}
        </div>
      )}
      {kind === BUILDING.GRANARY && (
        <>
          <div
            className="grainbrain-object-guideline-granaryborder"
            style={{
              top: `${CALCULATED.GRANARY_PADDING_PERCENT}%`,
              left: `${CALCULATED.GRANARY_PADDING_PERCENT}%`,
              width: `${CALCULATED.GRANARY_WIDTH_PERCENT}%`,
              height: `${CALCULATED.GRANARY_WIDTH_PERCENT}%`,
            }}
          />
          <div
            className="grainbrain-object-guideline-granaryarea"
            style={{
              width: `${CALCULATED.GRANARY_AREA_RADIUS_PERCENT}%`,
              height: `${CALCULATED.GRANARY_AREA_RADIUS_PERCENT}%`,
            }}
          />
        </>
      )}
      {kind === BUILDING.MILL && (
        <div
          className="grainbrain-object-guideline-granaryborder"
          style={{
            top: `${CALCULATED.MILL_PADDING_PERCENT}%`,
            left: `${CALCULATED.MILL_PADDING_PERCENT}%`,
            width: `${CALCULATED.MILL_WIDTH_PERCENT}%`,
            height: `${CALCULATED.MILL_WIDTH_PERCENT}%`,
          }}
        />
      )}
    </>
  );

  const objectTypeClassName = () => {
    let postfix = "";
    switch (kind) {
      case BUILDING.OTHER:
        postfix = "military";
        break;
      case BUILDING.FARM:
      case BUILDING.GRANARY:
      case BUILDING.MILL:
      default:
        postfix = "eco";
        break;
    }
    return "grainbrain-aoeicon-" + postfix;
  };
  const objectTypeIconSrc = () => {
    switch (kind) {
      case BUILDING.FARM:
        return "./asset/aoe4/farm.png";
      case BUILDING.GRANARY:
        return "./asset/aoe4/granary.png";
      case BUILDING.MILL:
        return "./asset/aoe4/mill.png";
      case BUILDING.OTHER:
        return otherBuildImgSrc(size.x);
    }
  };

  return (
    <>
      <div
        className={
          "grainbrain-object " +
          objectTypeClassName() +
          (blurred ? " grainbrain-object-blur" : "") +
          (lowlighted ? " grainbrain-object-lowlight" : "") +
          (highlighted ? " grainbrain-object-highlight" : "")
        }
        style={{
          width: area.x,
          height: area.y,
          left: position.left,
          top: position.top,
        }}
        onClick={() => onBuildingSelect(uuid)}
      >
        <img src={objectTypeIconSrc()} />
      </div>
      <div
        className={
          "grainbrain-guidelines" + (blurred ? " grainbrain-object-blur" : "")
        }
        style={{
          width: area.x,
          height: area.y,
          left: position.left,
          top: position.top,
        }}
      >
        {displayGuidelines && guidelines()}
      </div>
    </>
  );
}
