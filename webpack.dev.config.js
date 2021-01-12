const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const baseConfig = require("./webpack.base.config");
module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    contentBase: "./dist",
  },
  devtool: "inline-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
});
