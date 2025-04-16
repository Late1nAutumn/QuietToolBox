import { LANG } from "../../utils/enums";
import {
  APP_TYPE,
  GENRE,
  LANGUAGE_CODE,
  PRICE,
  RELEASE_DATE,
  STORE_CATEGORY,
} from "./steam";
import { request, toISODate, wait } from "../../utils/functions";
import { MISSING_APPS } from "./lists";
import STORED_APP_DETAIL from "./data/myAppDetail.json";

const STEAM_API_APP_DETAIL_COOLDOWN_MS = 6 * 60 * 1000; // 200 calls per 5 minutes
const REQUESTS_PER_COOLDOWN = 200;
const REQUESTS_INTERVAL = 1000;

export const appDataProcess = async (
  appList,
  lang,
  handler,
  final,
  delayedStart
) => {
  console.log(`[log]: process stint started`);
  if (delayedStart) {
    console.log(`[log]: process delay began`);
    await wait(STEAM_API_APP_DETAIL_COOLDOWN_MS);
    console.log(`[log]: process delay ended`);
  }
  let failList = [];
  for (let i = 0; i < appList.length; i++) {
    let { appid } = appList[i];
    try {
      console.log("processing " + i + " " + appid);
      let data = await request(`/data/steamster/app/${appid}/${lang}`);
      if (data[appid].success) {
        let obj = data[appid].data;
        handler(appList[i], obj);
      } else {
        failList.push(appid);
      }
    } catch (e) {
      failList.push(appid);
      console.error(e);
    } finally {
      if ((i + 1) % REQUESTS_PER_COOLDOWN === 0) {
        console.log(
          `[log]: loop report: ${i}/${
            appList.length
          } handled at ${new Date().toLocaleTimeString()}`
        );
        await wait(
          STEAM_API_APP_DETAIL_COOLDOWN_MS -
            REQUESTS_PER_COOLDOWN * REQUESTS_INTERVAL
        );
        console.log(`new loop started`);
      } else await wait(REQUESTS_INTERVAL);
    }
  }
  console.log(`[log]: process stint finished`);
  return final(failList);
};

export const universalDataProcessor = async (fullRun) => {
  console.log(`[log]: Data preprocess start!`);
  let report = {};
  window.processorResult = report;
  // #region get owned game list
  let requestAppList = await request("/data/steamster/mygames");
  console.log(
    `[log]: Owned data fetched! ${requestAppList.length} items on list`
  );
  requestAppList = requestAppList.map(
    ({ appid, playtime_forever, rtime_last_played }) => ({
      appid,
      playtime_forever,
      rtime_last_played,
    })
  );
  // if (!fullRun) {
  //   let collection = STORED_APP_DETAIL;
  // }
  // #endregion
  // #region get all game detail major
  let collection = {};
  let failList = [];
  let missingType = new Set();
  let missingCategory = {};
  let genreMap = {};
  let nonUSDApp = [];

  await appDataProcess(
    requestAppList,
    LANGUAGE_CODE[LANG.EN],
    ({ appid, playtime_forever, rtime_last_played }, obj) => {
      let {
        type,
        name,
        required_age,
        price_overview,
        categories,
        genres,
        achievements,
        release_date,
        ratings,
        fullgame,
      } = obj;
      if (!Object.values(APP_TYPE).includes(type)) missingType.add(type);
      if (price_overview && price_overview.currency !== "USD")
        nonUSDApp.push(appid);
      if (!categories) categories = [];
      if (!genres) genres = [];
      let appData = {
        appid,
        type,
        name: { [LANG.EN]: name },
        requiredAge: Math.max(
          Number(required_age || "0"),
          Object.values(ratings || {}).reduce(
            (acc, { rating }) => Math.max(Number(rating || "0"), acc),
            0
          ) || 0
        ),
        price:
          price_overview?.initial_formatted ||
          price_overview?.final_formatted ||
          PRICE.FREE,
        categories: categories.map(({ id }) => {
          if (!STORE_CATEGORY[id] && !missingCategory[id])
            missingCategory[id] = appid;
          return id;
        }),
        genres: genres.map(({ id, description }) => {
          if (!genreMap[id]) genreMap[id] = {};
          genreMap[id][LANG.EN] = description;
          return id;
        }),
        achievements: achievements?.total || 0,
        totalTime: playtime_forever,
        lastTime: rtime_last_played,

        fullgame,
      };
      if (release_date.coming_soon)
        appData.releaseDate = RELEASE_DATE.COMMING_SOON;
      else {
        try {
          appData.releaseDate = toISODate(release_date.date);
        } catch (e) {
          appData.releaseDate = RELEASE_DATE.UNKNOWN;
        }
      }
      collection[appid] = appData;
    },
    (fList) => {
      let length = Object.keys(collection).length;
      if (requestAppList.length !== length) {
        console.log(
          `[WARNING]: ${length}/${requestAppList.length} apps processed, ${
            requestAppList.length - length
          } missing`
        );
      }
      let tempSet = new Set();
      requestAppList.forEach(({ appid }) => {
        tempSet.add(appid);
      });
      Object.keys(collection).forEach((appid) => {
        tempSet.delete(appid);
      });
      failList.forEach((appid) => {
        tempSet.add(appid);
      });
      fList.forEach((appid) => {
        tempSet.add(appid);
      });
      console.log(
        `[log]: Major app detail download complete, ${tempSet.size} failed objects found:`
      );
      console.log(tempSet);
      failList = [...tempSet];
      report.failList = failList;
      report.missingType = missingType;
      return collection;
    },
    false
  );
  // #endregion
  // #region get all game CN values
  const processLanguageData = async (lang) => {
    await appDataProcess(
      requestAppList,
      LANGUAGE_CODE[lang],
      ({ appid }, obj) => {
        let { name, genres } = obj;
        let target = collection[appid];
        if (name !== target.name[LANG.EN]) target.name[lang] = name;

        (genres || []).forEach(({ id, description }) => {
          if (!genreMap[id]) genreMap[id] = {};
          genreMap[id][lang] = description;
        });
      },
      (fList) => {},
      true
    );
  };
  await processLanguageData(LANG.CN);
  console.log(`[log]: CN app detail download complete`);
  // #endregion
  report.collection = collection;
  // #region compare genre with stored list
  for (let id in genreMap) {
    if (!GENRE[id]) {
      console.log(`[WARNING]: missing genre detected! Please update:`);
      console.log(genreMap);
      report.genreMap = genreMap;
      break;
    }
  }
  // #endregion
  // #region compare category with stored list
  if (Object.keys(missingCategory).length) {
    console.log(`[WARNING]: missing category detected!`);
    for (let id in missingCategory)
      console.log(`id:${id}, sample App:${missingCategory[id]}`);
    report.missingCategory = missingCategory;
  }
  // #endregion
  // #region compare missing app with stored list
  report.failList = requestAppList.reduce((acc, { appid }) => {
    if (!collection[appid]) acc.push(appid);
    return acc;
  }, []);

  let tempSet = new Set(MISSING_APPS);
  for (let appid of report.failList)
    if (!tempSet.has(appid)) {
      console.log(
        `[WARNING]: Missing app data mismatch. MISSING_APPS list to be updated`
      );
      console.log(report.failList);
      break;
    }
  // #endregion

  // non USD price app
  console.log(`[log]: following apps are not priced by USD:`);
  console.log(nonUSDApp);
  report.nonUSDApp = nonUSDApp;

  // handle full game
  report.redundantDemo = Object.values(collection).reduce(
    (acc, { appid, fullgame }) => {
      if (fullgame && collection[fullgame.appid])
        acc.push({ demo: appid, fullgame: fullgame.appid });
      return acc;
    },
    []
  );

  // handle achieved achievements
  report.achievedDataError = [];
  for (let key in collection) {
    let { appid, achievements } = collection[key];
    if (achievements) {
      await wait(1000);
      let achievedCount = 0;
      let { achievements, success } = await request(
        "/data/steamster/achievement/" + appid
      );
      if (success) {
        achievements.forEach(({ achieved }) => {
          achievedCount += achieved;
        });
        collection[key].achieved = achievedCount;
      } else {
        console.log("[ERROR]:failed to get data for " + appid);
        report.achievedDataError.push(appid);
      }
    }
  }

  console.log(`[REPORT]: full report:`);
  console.log(report);
  return report;
};

// export const createAppDetailSample = async (appList) => {
//   let fields = {};
//   let fieldSource = {};
//   let categories = {};
//   let genres = {};

//   await appDataProcess(
//     appList,
//     (appId, obj) => {
//       for (let field in obj) {
//         if (!fields[field]) {
//           fields[field] = obj[field];
//           fieldSource[field] = appId;
//         }
//       }
//       obj.categories.forEach(({ id, description }) => {
//         if (!categories[id]) categories[id] = [];
//         categories[id].push(description);
//       });
//       obj.genres.forEach(({ id, description }) => {
//         if (!genres[id]) genres[id] = [];
//         genres[id].push(description);
//       });
//     },
//     (failList) => {
//       console.log("fields:");
//       console.log(fields);
//       console.log("field sources:");
//       console.log(fieldSource);
//       console.log("failed apps:");
//       console.log(failList);
//       console.log("categories");
//       console.log(categories);
//       console.log("genres");
//       console.log(genres);
//     }
//   );
// };
