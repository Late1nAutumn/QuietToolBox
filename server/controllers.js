const { STEAM_LINKS, MY_STEAM_ID } = require("../src/Steamster/constants");
const keys = require("./keys");
const { STEAM_API_KEY } = keys;

module.exports = {
  getOwnedGames: (req, res) => {
    // let url = "http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=440&format=json";
    let url = STEAM_LINKS.userOwnedGames(STEAM_API_KEY, MY_STEAM_ID);
    fetch(url).then((data) => {
      data.json().then(({ response }) => {
        res.send(response.games);
      });
    });
  },
  getUserSummaries: (req, res) => {
    let url = STEAM_LINKS.userSummary(STEAM_API_KEY, MY_STEAM_ID);
    fetch(url).then((data) => {
      data.json().then(({ response }) => {
        res.send(response.players[0]);
      });
    });
  },
  getAppDetail: (req, res) => {
    let { appid, lang } = req.params;
    let url = STEAM_LINKS.appDetail(appid, lang);
    fetch(url).then((data) => {
      data.json().then((data) => {
        res.send(data);
      });
    });
  },
  getAchievement: (req, res) => {
    let { appid } = req.params;
    let url = STEAM_LINKS.playerAchievements(STEAM_API_KEY, appid, MY_STEAM_ID);
    fetch(url).then((data) => {
      data.json().then((data) => {
        res.send(data.playerstats);
      });
    });
  },
};
