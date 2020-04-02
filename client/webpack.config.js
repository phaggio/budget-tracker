const WebpackPwaManifest = require(`webpack-pwa-manifest`);
const path = require(`path`);

const config = {
  entry: {
    index: `./assets/js/index.js`
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name].bundle.js`
  },
  mode: `development`,
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: `Budget Tracker`,
      short_name: `Budget Tracker`,
      description: `A budget tracking application`,
      background_color: `#01579b`,
      theme_color: `#ffffff`,
      start_url: `/`,
      icons: [
        {
          src: path.resolve(`./assets/images/icons/icon-128x128.png`),
          sizes: [96, 128, 256, 512],
          destination: path.join(`assets`, `icons`)
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`@babel/preset-env`]
          }
        }
      }
    ]
  }
};

module.exports = config;
