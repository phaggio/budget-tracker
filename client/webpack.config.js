// const SWPrecacheWebpackPlugin = require(`sw-precache-webpack-plugin`);
// const WebpackPwaManifest = require(`webpack-pwa-manifest`);
const path = require(`path`);

const config = {
  entry: {
    index: `./assets/js/index.js`
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name].bundle.js`
  }
};

module.exports = config;
