// This server is for test purpose to support react router
const express = require("express");
const bParser = require("body-parser");
const path = require("path");

const {
  getOwnedGames,
  getUserSummaries,
  getAppDetail,
  getAchievement,
} = require("./controllers.js");

const port = 3000;

const root = path.join(__dirname, "../public");

const app = express();
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));

app.use("/data/steamster/mygames", getOwnedGames);
app.use("/data/steamster/myprofile", getUserSummaries);
app.use("/data/steamster/app/:appid/:lang", getAppDetail);
app.use("/data/steamster/achievement/:appid", getAchievement);

app.use("/", express.static(root));
app.get("*", (req, res) => res.sendFile("index.html", { root }));

app.listen(port, () => {
  console.log("server online:" + port);
});
