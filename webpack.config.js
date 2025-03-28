
const path = require("path");

module.exports = {
  entry: ["babel-polyfill", path.resolve(__dirname, "./src/App.jsx")],
  output: {
    path: path.resolve(__dirname, "./public/bundle"),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js[x]?/,
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
