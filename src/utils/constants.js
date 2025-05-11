import { LANG } from "./enums";

// #region portrait
export const PORTRAIT_EYE_TRACK_COOLDOWN = 50;
// #endregion

// #region chatbox
export const DEFAULT_CHATBOX_TEXT_SPEED = 30;
export const DEFAULT_CHATBOX_PRASE_WAIT = 1500;
export const DEFAULT_CHATBOX_DIALOG_WAIT = 3000;
export const IDLE_TIMEOUT = {
  BASE_TIME: 3000,
  MAX_RANDOM_TIME: 2000,
};
// #endregion

// #region app list
// defined here instead of enum to avoid looping import
export const APP = {
  NIKKI_KIWI: 1,
  SKETCHER: 2,
  STEAMSTER: 3,
  GRAIN_GRAIN: 4,
  DASHBOARD: 5,
};

export const HOME_TITLE = "Nexus";
export const HOME_FAVICON = "/asset/favicon/nexus.png";

export const APPS = {
  [APP.NIKKI_KIWI]: {
    favicon: "/asset/favicon/nikkikiwi.png",
    text: "Nikki Kiwi",
    link: "/nikki",
    cover: "/asset/cover/nikkikiwi.png",
    intro: {
      [LANG.EN]: "To check gears' stats in Inifinity Nikki",
      [LANG.CN]: "无限暖暖装备属性比较",
    },
  },
  [APP.SKETCHER]: {
    favicon: "/asset/favicon/sketcher.png",
    text: "Sketcher",
    link: "/sketcher",
    cover: "/asset/cover/sketcher.png",
    intro: {
      [LANG.EN]: "This helps me draw SVG paths out of images",
      [LANG.CN]: "我拿这个来描图画svg",
    },
  },
  [APP.STEAMSTER]: {
    favicon: "/asset/favicon/steamster.png",
    text: "Steamster",
    link: "/steamster",
    cover: "/asset/cover/steamster.png",
    intro: {
      [LANG.EN]: "Wanna check my games on Steam?",
      [LANG.CN]: "看看我的Steam库存？",
    },
  },
  [APP.GRAIN_GRAIN]: {
    favicon: "/asset/favicon/grainBrain.png",
    text: "Grain Brain",
    link: "/granary",
    cover: "/asset/cover/grainBrain.png",
    intro: {
      [LANG.EN]: "Play Age of Empires 4?\nWe have the ultimate solution for grainary optimization here.",
      [LANG.CN]: "谷仓强迫症的终极福音",
    },
  },
  [APP.DASHBOARD]: {
    favicon: "",
    text: "Dashboard",
    link: "/",
    cover: "/asset/cover/underConstruction.png",
    intro: {
      [LANG.EN]: "This app is under construction",
      [LANG.CN]: "别催了在做了",
    },
  },
};

export const AUTO_SCROLL_DELAY = 50;
export const SCREEN_THRESHOLD = {
  FULL_ZOOM_IN: 0.15,
  FULL_ZOOM_OUT: 0.55,
};
export const APP_IMG_SIZE = { MAX: 295, MIN: 150 };
export const APP_IMG_GRID_SIZE = 300;
// #endregion
