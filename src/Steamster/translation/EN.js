import { GROUP_MODE, SORT_MODE } from "../dataProcess/enums.js";
import {
  ACHIEVEMENT_STATUS,
  APP_TYPE,
  APP_PLAYED,
  PRICE,
  RELEASE_DATE,
  RECOMMEND,
} from "../dataProcess/steam.js";
import {
  TOOLTIP_CONTEXT,
  NAVBAR_CONTEXT,
  APP_MISC_CONTEXT,
  TRANSLATE_COLLECTION,
} from "./context.js";

const {
  COLLECTION_TITLE_APP_TYPE,
  COLLECTION_TITLE_PRICE,
  COLLECTION_TITLE_APP_PLAYED,
  COLLECTION_TITLE_ACHIEVEMENT,
  COLLECTION_TITLE_RECOMMEND,
  APP_TOOLTIP,
  GROUP_MODES,
  SORT_MODES,
  NAVBAR,
  APP_MISC,
} = TRANSLATE_COLLECTION;

export const EN_PACK = {
  [COLLECTION_TITLE_APP_TYPE]: {
    [APP_TYPE.GAME]: "Game",
    [APP_TYPE.DEMO]: "Demo",
    [APP_TYPE.MOD]: "Mod",
  },
  [COLLECTION_TITLE_PRICE]: {
    [PRICE.FREE]: "Free game",
    [PRICE.NOT_FREE]: "Paid game",
  },
  [COLLECTION_TITLE_APP_PLAYED]: {
    [APP_PLAYED.NEVER_PLAYED]: "Never played",
    [APP_PLAYED.PLAYED]: "Used app",
    [APP_PLAYED.CLOUDED]: "Stream-watched",
  },
  [COLLECTION_TITLE_ACHIEVEMENT]: {
    [ACHIEVEMENT_STATUS.COMPELETED]: "Compeleted",
    [ACHIEVEMENT_STATUS.NEARLY]: "Nearly done",
    [ACHIEVEMENT_STATUS.PROGRESSING]: "Progressing",
    [ACHIEVEMENT_STATUS.UNSTARTED]: "Unstarted",
  },
  [COLLECTION_TITLE_RECOMMEND]: {
    [RECOMMEND.WORTHY]: "Must-try",
    [RECOMMEND.AGAINST]: "Trash",
  },
  [APP_TOOLTIP]: {
    [TOOLTIP_CONTEXT.TOTAL_TIME]: "Total time",
    [TOOLTIP_CONTEXT.LAST_TIME]: "Last time",
    [TOOLTIP_CONTEXT.PLAYED_STATUS]: "Never played",
    [TOOLTIP_CONTEXT.ACHIEVEMENT]: "Achievements",
    [TOOLTIP_CONTEXT.GENRE]: "Genres",
    [TOOLTIP_CONTEXT.CATEGORY]: "Categories",
    [TOOLTIP_CONTEXT.RELEASE]: "Game release",

    [PRICE.FREE]: "Free",
    [RELEASE_DATE.COMMING_SOON]: "Unreleased",
  },
  [GROUP_MODES]: {
    [GROUP_MODE.APP_TYPE]: "App type",
    [GROUP_MODE.GENRE]: "Genre",
    [GROUP_MODE.CATEGORY]: "Category",
    [GROUP_MODE.FREE_GAME]: "Free game",
    [GROUP_MODE.NEVER_PLAYED]: "I never played",
    [GROUP_MODE.MY_RECOMMENDATION]: "My recommendation",
    [GROUP_MODE.MY_ACHIEVEMENT]: "My achievement",
  },
  [SORT_MODES]: {
    [SORT_MODE.RELEASE_DATE]: "Release date",
    [SORT_MODE.PRICE]: "Price",
    [SORT_MODE.MY_RATING]: "MyGN",
    [SORT_MODE.MY_GAME_TIME]: "My game time",
    [SORT_MODE.MY_LAST_TIME]: "My last time",
    [SORT_MODE.MY_ACHIEVEMENT]: "My achievement",
  },
  [NAVBAR]: {
    [NAVBAR_CONTEXT.SEARCH]: "Search",
    [NAVBAR_CONTEXT.GROUP_BY]: "Group by",
    [NAVBAR_CONTEXT.SORT_BY]: "Sort by",
    [NAVBAR_CONTEXT.LAST_UPDATE]: "Last update",
  },
  [APP_MISC]: {
    [APP_MISC_CONTEXT.LOADING]: "Loading more content",
    [APP_MISC_CONTEXT.NO_MATCH]: "No matched result",
  },
};
