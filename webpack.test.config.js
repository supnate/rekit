const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const webpackConfig = require('./webpack-config');

// Since webpack.test.config.js is used by command line, save it as a separate file.

module.exports = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  plugins: [
    new webpack.DefinePlugin({
      ENV: '"test"',
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
      }
    })
  ],
  module: webpackConfig('test').module,
};
