`use strict`;

const path = require(`path`);
const webpack = require(`webpack`);
const autoprefixer = require(`autoprefixer`);
const Notifier = require(`webpack-notifier`);

module.exports = {
  devtool: `eval`,
  debug: true,
  entry: [
    `webpack-hot-middleware/client`,
    `./src/index`,
  ],
  output: {
    path: path.join(__dirname, `dist`),
    filename: `app.js`,
    publicPath: `/static/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new Notifier({
      title: `Account-cycle:`,
      contentImage: `./doge.png`,
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [`babel`],
      include: path.join(__dirname, `src`),
    }, {
      test: /\.styl$/,
      loaders: [`style`, `css`, `postcss`, `stylus`],
      include: path.join(__dirname, `src`),
    }, {
      test: /\.(woff|jpg|gif)$/,
      loaders: [`file?name=[path][name].[ext]`],
      include: path.join(__dirname, `src`),
    }],
  },
  postcss: [
    autoprefixer({ browsers: [`last 2 versions`] }),
  ],
  resolve: {
    root: [
      `${__dirname}/src/`,
    ],
  },
};
