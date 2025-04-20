export const request = async (url) => {
  let data = await fetch(url);
  let json = await data.json();
  return json;
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// browser default event "beforeunload" handler
export const onLeavePage = (e) => {
  e.preventDefault();
  e.returnValue = "反正没人会看到这行字";
};

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

export const rgbToHex = (r, g, b) =>
  `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

export const copyToClipboard = async (content) =>
  navigator.clipboard
    .writeText(content)
    .then(() => console.log("[log]: content copied to clipboard"))
    .catch((err) => console.log("[ERROR]: copy failed:", err));

export const toISODate = (date) => new Date(date).toISOString().split("T")[0];
