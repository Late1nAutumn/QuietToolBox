import { LANG } from "./enums";

export const request = async (url) => {
  let data = await fetch(url);
  let json = await data.json();
  return json;
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sortByProperty = (arr, property, reverse) => {
  let temp = arr.slice();
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++) {
      if (!reverse) {
        if (arr[i][property] > arr[j][property]) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      } else if (arr[i][property] < arr[j][property]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  return temp;
};

// #region math
export const pointDistance = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
export const coordDistance = (c1, c2) =>
  Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);

export const decimaling = (value, digits) => {
  if (digits < 0) return value;
  let multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

export const rgbToHex = (r, g, b) =>
  `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
// #endregion

export const preventDefault = (e) => e.preventDefault();
// browser default event "beforeunload" handler
export const onLeavePage = (e) => {
  e.preventDefault();
  e.returnValue = "どうせ誰にもこの行は見られない";
};

// #region browser
export const toISODate = (date) => new Date(date).toISOString().split("T")[0];

export const setFavicon = (path) => {
  const favicon = document.querySelector("link[rel='icon']");
  if (favicon) favicon.href = path;
};

export const copyToClipboard = async (content) =>
  navigator.clipboard
    .writeText(content)
    .then(() => console.log("[log]: content copied to clipboard"))
    .catch((err) => console.log("[ERROR]: copy failed:", err));

export const mapNavigatorLang = () => {
  const lang = navigator.language.toLowerCase().slice(0, 2);
  switch (lang) {
    case "zh":
      return LANG.CN;
    case "en":
    default:
      return LANG.EN;
  }
};

export const isMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// #endregion
