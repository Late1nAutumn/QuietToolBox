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
  STEAMSTER: 1,
  GRAIN_BRAIN: 2,
  COLORBLINDER: 3,
  NIKKI_KIWI: 4,
  SKETCHER: 5,
  DASHBOARD: 6,
};

export const HOME_TITLE = "Nexus";
export const HOME_FAVICON = "/asset/favicon/nexus.png";

export const APPS = {
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
  [APP.GRAIN_BRAIN]: {
    favicon: "/asset/favicon/grainBrain.png",
    text: "Grain Brain",
    link: "/granary",
    cover: "/asset/cover/grainBrain.png",
    intro: {
      [LANG.EN]: "Play Age of Empires 4?\nWe have the ultimate solution for grainary optimization here.",
      [LANG.CN]: "谷仓强迫症的终极福音",
    },
  },
  [APP.COLORBLINDER]: {
    favicon: "/asset/favicon/colorblinder.png",
    text: "Colorblinder",
    link: "/color",
    cover: "/asset/cover/colorblinder.png",
    intro: {
      [LANG.EN]: "I'm trying to understand palettes from a spatial perspective",
      [LANG.CN]: "我想让色盲也能看懂配色关系",
    },
  },
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
      [LANG.CN]: "我需要画svg的时候就会用这个",
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
