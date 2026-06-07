const LAST_DATA_UPDATE = "2025-4-13";

const ITEM_REFILL_AMOUNT = 18;
const ITEM_REFILL_TRIGGER = 1.5;

const SEARCH_DEBOUNCE_COOLDOWN = 500;

// #region steam
const MY_STEAM_ID = "76561198112898100";

const STEAM_LINKS = {
  appStorePage: (appid) => `https://store.steampowered.com/app/${appid}`,
  appStanding: (appid) =>
    `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
  appBanner: (appid) =>
    `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg?t=1738796058`,
  // CORSed
  userOwnedGames: (apiKey, userId) =>
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${userId}&format=json`,
  userSummary: (apiKey, userId) =>
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`,
  appDetail: (appid, lang) =>
    `https://store.steampowered.com/api/appdetails?appids=${appid}&l=${
      lang || "english"
    }`,
  playerAchievements: (apiKey, appid, userId) =>
    `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${apiKey}&steamid=${userId}`,
};
// #endregion

module.exports = {
  LAST_DATA_UPDATE,
  ITEM_REFILL_AMOUNT,
  ITEM_REFILL_TRIGGER,
  SEARCH_DEBOUNCE_COOLDOWN,
  MY_STEAM_ID,
  STEAM_LINKS,
};