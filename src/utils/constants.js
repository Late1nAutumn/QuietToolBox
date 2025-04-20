// #region portrait
export const PORTRAIT_EYE_TRACK_COOLDOWN = 50;
// #endregion

// #region chatbox
export const DEFAULT_CHATBOX_TEXT_SPEED = 30;
export const DEFAULT_CHATBOX_PRASE_DURATION = 2000;
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
  DIVER_TRAINER: 4,
  DASHBOARD: 5,
};

export const APPS = {
  [APP.NIKKI_KIWI]: {
    link: "/nikki",
    text: "Nikki Kiwi",
    cover: "./asset/nikkikiwiCover.png",
  },
  [APP.SKETCHER]: {
    link: "/sketcher",
    text: "Sketcher",
    cover: "./asset/sketcherCover.png",
  },
  [APP.STEAMSTER]: {
    link: "/steamster",
    text: "Steamster",
    cover: "./asset/steamsterCover.png",
  },
  [APP.DIVER_TRAINER]: {
    link: "/",
    text: "Diver Trainer",
    cover: "./asset/underConstructionCover.png",
  },
  [APP.DASHBOARD]: {
    link: "/",
    text: "Dashboard",
    cover: "./asset/underConstructionCover.png",
  },
};

export const SCREEN_THRESHOLD = {
  FULL_ZOOM_IN: 0.15,
  FULL_ZOOM_OUT: 0.55,
};
export const APP_IMG_SIZE = { MAX: 295, MIN: 150 };
export const APP_IMG_GRID_SIZE = 300;
// #endregion
