import { LINE_COMMAND } from "./enum";

export const exportSvg = (paths, imgSize) =>
  `<svg
      width="${imgSize.width}px"
      height="${imgSize.height}px"
      viewBox="0 0 ${imgSize.width} ${imgSize.height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${paths.map(
        ({ points, closing, stroke, fill, fillEven }) =>
          `<path
          d="${pointsToPathD(points, closing)}"
          stroke="${stroke}"
          fill="${fill}"
          fill-rule="${fillEven ? "evenodd" : "nonzero"}"
        ></path>\n`
      )}
    </svg>`;

export const pathToPoints = (d) => {
  let path = d.trim();
  let validation = true;
  let points = [];
  let pointStartIndex = 0;
  for (let i = 0; i < path.length; i++) {
    if (
      (path[i] >= "a" && path[i] <= "z") ||
      (path[i] >= "A" && path[i] <= "Z") ||
      i === path.length - 1
    ) {
      if (i === path.length - 1) i++;
      let cmd = path[pointStartIndex];
      switch (cmd) {
        case "z":
        case "Z":
          continue;
        case LINE_COMMAND.LINE_TO_ABSOLUTE:
        case LINE_COMMAND.LINE_TO_RELATIVE:
          break;
        default:
          validation = false;
          break;
      }
      let section = path.slice(pointStartIndex + 1, i).trim();
      if (!section) {
        validation = false;
        continue;
      }
      let coords = [];
      let coordStartIndex = pointStartIndex;
      for (let j = 0; j < section.length; j++) {
        if (path[j] === " " || path[j] === "," || j === i - 1) {
          if (j === i - 1) j++;
          let str = path.slice(coordStartIndex, j);
          if (!str) continue;
          let num = Number(str);
          if (num === NaN) validation = false;
          else coords.push(num);
          coordStartIndex = j;
        }
      }
      if (coords.length !== 2) validation = false;
      let x = coords[0] || 0;
      let y = coords[1] || 0;
      points.push({ cmd, x, y });
      pointStartIndex = i;
    }
  }
  return { validation, points };
};

export const pointsToPathD = (points, closing) => {
  let d = points.map(({ cmd, x, y }) => `${cmd}${x} ${y}`).join("");
  if (!d) return "";
  d = "M" + d.slice(1);
  if (closing) d += "z";
  return d;
};
