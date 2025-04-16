import { LOAD_STATUS } from "../utils/enums";
import {
  GENERAL_TRANSLATE_COLLECTION,
  TIME_CONTEXT,
} from "../utils/translation/context";
import { generalTranslator } from "../utils/translation/translator";
import { ITEM_REFILL_AMOUNT } from "./constants";
import { GROUP_MODE, SORT_MODE } from "./dataProcess/enums";
import {
  MY_CLOUDED_APPS,
  HIDDEN_APPS,
  IGNORED_CATEGORIES,
  LIMITED_FREE_APPS,
  MY_RECOMMENDED_APPS,
  MY_OPPOSED_APPS,
  MY_RATING,
} from "./dataProcess/lists";
import {
  ACHIEVEMENT_STATUS,
  APP_TYPE,
  APP_PLAYED,
  GENRE,
  PRICE,
  STORE_CATEGORY,
  RECOMMEND,
} from "./dataProcess/steam";
import { TRANSLATE_COLLECTION } from "./translation/context";
import { translator } from "./translation/translator";

export const collectionGrouper = (DATA, groupMode, lang, hideApps, keyword) => {
  let temp = [];
  let collections = {};
  let filteredData = Object.values(DATA);
  if (hideApps)
    filteredData = filteredData.filter(({ appid }) => !HIDDEN_APPS.has(appid));
  if (keyword)
    filteredData = filteredData.filter(({ name }) => {
      for (let language in name)
        if (name[language].toLowerCase().includes(keyword.toLowerCase()))
          return true;
      return false;
    });
  switch (groupMode) {
    case GROUP_MODE.APP_TYPE:
      collections = {};
      Object.values(APP_TYPE).forEach((type) => {
        collections[type] = [];
      });
      filteredData.forEach((data) => {
        let { type } = data;
        collections[type].push(data);
      });
      temp = Object.values(APP_TYPE).map((type) => ({
        title: translator(
          type,
          lang,
          TRANSLATE_COLLECTION.COLLECTION_TITLE_APP_TYPE
        ),
        list: collections[type],
      }));
      break;
    case GROUP_MODE.CATEGORY:
      filteredData.forEach((data) => {
        let { categories } = data;
        categories.forEach((id) => {
          if (!collections[id]) collections[id] = [];
          collections[id].push(data);
        });
      });
      temp = Object.keys(collections).map((id) => ({
        title: categoryMapper(id, lang),
        list: collections[id],
      }));
      break;
    case GROUP_MODE.GENRE:
      filteredData.forEach((data) => {
        let { appid, genres } = data;
        genres.forEach((id) => {
          if (!collections[id]) collections[id] = [];
          collections[id].push(data);
        });
      });
      temp = Object.keys(collections).map((id) => ({
        title: GENRE[id][lang],
        list: collections[id],
      }));
      break;
    case GROUP_MODE.FREE_GAME:
      collections = {};
      Object.values(PRICE).forEach((status) => {
        collections[status] = [];
      });
      filteredData.forEach((data) => {
        let { appid, price } = data;
        if (price !== PRICE.FREE && !LIMITED_FREE_APPS.has(appid)) {
          price = PRICE.NOT_FREE;
        }
        if (!collections[price]) collections[price] = [];
        collections[price].push(data);
      });
      temp = Object.values(PRICE).map((price) => ({
        title: translator(
          price,
          lang,
          TRANSLATE_COLLECTION.COLLECTION_TITLE_PRICE
        ),
        list: collections[price],
      }));
      break;
    case GROUP_MODE.NEVER_PLAYED:
      collections = {};
      Object.values(APP_PLAYED).forEach((status) => {
        collections[status] = [];
      });
      filteredData.forEach((data) => {
        let { appid, totalTime } = data;
        let field = totalTime > 0 ? APP_PLAYED.PLAYED : APP_PLAYED.NEVER_PLAYED;
        collections[field].push(data);
        if (MY_CLOUDED_APPS.has(appid))
          collections[APP_PLAYED.CLOUDED].push(data);
      });
      temp = Object.values(APP_PLAYED).map((status) => ({
        title: translator(
          status,
          lang,
          TRANSLATE_COLLECTION.COLLECTION_TITLE_APP_PLAYED
        ),
        list: collections[status],
      }));
      break;
    case GROUP_MODE.MY_RECOMMENDATION:
      collections = {
        [RECOMMEND.WORTHY]: [...MY_RECOMMENDED_APPS].map(
          (appid) => DATA[appid]
        ),
        [RECOMMEND.AGAINST]: [...MY_OPPOSED_APPS].map((appid) => DATA[appid]),
      };
      temp = Object.values(RECOMMEND).map((status) => ({
        title: translator(
          status,
          lang,
          TRANSLATE_COLLECTION.COLLECTION_TITLE_RECOMMEND
        ),
        list: collections[status],
      }));
      break;
    case GROUP_MODE.MY_ACHIEVEMENT:
      collections = {};
      Object.values(ACHIEVEMENT_STATUS).forEach((status) => {
        collections[status] = [];
      });
      filteredData.forEach((data) => {
        let { achieved, achievements } = data;
        if (!achievements) return;

        let status = ACHIEVEMENT_STATUS.PROGRESSING;
        if (achieved === 0) status = ACHIEVEMENT_STATUS.UNSTARTED;
        else if (achieved >= achievements)
          status = ACHIEVEMENT_STATUS.COMPELETED;
        else if (achieved / achievements > 0.8 || achievements - achieved < 6)
          status = ACHIEVEMENT_STATUS.NEARLY;

        collections[status].push(data);
      });
      temp = Object.values(ACHIEVEMENT_STATUS).map((status) => ({
        title: translator(
          status,
          lang,
          TRANSLATE_COLLECTION.COLLECTION_TITLE_ACHIEVEMENT
        ),
        list: collections[status],
      }));
      break;
  }
  temp = temp.filter(({ list }) => list.length > 0);
  temp.forEach((_, i) => {
    temp[i].expand = LOAD_STATUS.LOADING;
    temp[i].displayAmount = ITEM_REFILL_AMOUNT;
  });
  // TODO: map, filter lists
  return temp;
};

export const collectionSorter = (collections, sortMode) => {
  let temp = collections.slice();
  temp.forEach((_, i) => {
    switch (sortMode) {
      case SORT_MODE.RELEASE_DATE:
        temp[i].list.sort((a, b) =>
          b.releaseDate.localeCompare(a.releaseDate, undefined, {
            numeric: true,
          })
        );
        break;
      case SORT_MODE.PRICE:
        temp[i].list.sort((a, b) =>
          a.price.localeCompare(b.price, undefined, {
            numeric: true,
          })
        );
        break;
      case SORT_MODE.MY_RATING:
        temp[i].list.sort(
          (a, b) => (MY_RATING[b.appid] || 0) - (MY_RATING[a.appid] || 0)
        );
        break;
      case SORT_MODE.MY_GAME_TIME:
        temp[i].list.sort((a, b) => b.totalTime - a.totalTime);
        break;
      case SORT_MODE.MY_LAST_TIME:
        temp[i].list.sort((a, b) => b.lastTime - a.lastTime);
        break;
      case SORT_MODE.MY_ACHIEVEMENT:
        temp[i].list.sort(
          (a, b) =>
            achievementPortion(b.achieved, b.achievements) -
              achievementPortion(a.achieved, a.achievements) ||
            b.achievements - a.achievements
        );
        break;
      default:
        break;
    }
  });
  return temp;
};

export const categoryMapper = (id, lang) => {
  if (IGNORED_CATEGORIES.includes(id)) return;
  let category = STORE_CATEGORY[id];
  return category ? category[lang] : id;
};

export const playLength = (time, lang) => {
  let hours = Math.round(time / 6) / 10;
  return hours >= 1
    ? `${hours} ${generalTranslator(
        TIME_CONTEXT.HOUR,
        lang,
        GENERAL_TRANSLATE_COLLECTION.TIME
      )}`
    : `${time} ${generalTranslator(
        TIME_CONTEXT.MINUTE,
        lang,
        GENERAL_TRANSLATE_COLLECTION.TIME
      )}`;
};

export const achievementPortion = (progress, total) =>
  (progress || 0) / (total || 1);
