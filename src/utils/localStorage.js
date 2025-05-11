export const STORE = {
  MAIN: "mainStore",
  GRAIN_BRAIN: "granaryStore",
};

export const FIELD = {
  // main
  SKIP_PORTRAIT_ANIMATION: "skipPortrait",
  // granary
  AUTO_SAVE: "autoSave",
  MANUAL_SAVE: "manualSave",
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

  [STORE.MAIN]: {
    getIsPortraitSkipped: () =>
      read(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION) || false,
    setSkipPortrait: () =>
      write(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION, true),
  },

  [STORE.GRAIN_BRAIN]: {
    autoSave: (atlas) => write(STORE.GRAIN_BRAIN, FIELD.AUTO_SAVE, atlas),
    loadAutoSave: () => read(STORE.GRAIN_BRAIN, FIELD.AUTO_SAVE) || null,
    saveProgess: (atlas, savename) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || {};
      savePack[savename] = atlas;
      write(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE, savePack);
    },
    getSaveList: () => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || null;
      return savePack;
    },
    getSave: (name) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || null;
      return savePack?.[name] || null;
    },
    deleteSave: (name) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || null;
      delete savePack[name];
      write(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE, savePack);
    },
  },
};
