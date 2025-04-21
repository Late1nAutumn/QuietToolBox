export const STORE = {
  MAIN: "mainStore",
};

export const FIELD = {
  SKIP_PORTRAIT_ANIMATION: "skipPortrait",
};

const read = (store, field) => {
  let dataString = localStorage.getItem(store);
  if (!dataString) return null;
  try {
    return JSON.parse(dataString)[field];
  } catch (e) {
    return null;
  }
};

const write = (store, field, value) => {
  try {
    let dataString = localStorage.getItem(store);
    if (!dataString) throw "inexist";
    let obj = JSON.parse(dataString);
    if (typeof obj !== "object") throw "invalid type";
    obj[field] = value;
    localStorage.setItem(store, JSON.stringify(obj));
  } catch (e) {
    localStorage.setItem(store, JSON.stringify({ [field]: value }));
  }
};

export const LOCALSTORAGE = {
  initStore: (store) => {
    try {
      let str = localStorage.getItem(store);
      if (!str) {
        throw "inexist";
      }
      let obj = JSON.parse(str);
      if (typeof obj !== "object") throw "invalid type";
    } catch (e) {
      localStorage.setItem(store, JSON.stringify({}));
    }
  },
  getIsPortraitSkipped: () =>
    read(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION) || false,
  setSkipPortrait: () => write(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION, true),
};
