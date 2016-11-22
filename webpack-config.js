'use strict';
//  Summary:
//    Get webpack config for different using

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const pkgJson = require('./package.json');

pkgJson.rekit = pkgJson.rekit || {
  devPort: 6076,
  buildPort: 6077,
  css: 'less', // scss | less | css
};

module.exports = (type) => { // eslint-disable-line
  // type is one of [dev, dll, test, dist]

  const isDev = type === 'dev';

  return {
    devtool: {
      dev: 'eval',
      dll: false,
      test: false,
      dist: false,
    }[type],
    cache: true,
    context: path.join(__dirname, 'src'),

    entry: {
      dev: [
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?http://0.0.0.0:${pkgJson.rekit.devPort}`,
        './styles/index.less',
        './index',
      ],
      dll: [],
      test: [],
      dist: [],
    }[type],

    output: {
      filename: '[name].bundle.js',

      // where to save your build result
      path: path.join(__dirname, 'build/static'),

      // exposed asset path
      publicPath: '/static'
    },

    plugins: _.compact([
      isDev && new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(type),
        }
      })
    ]),

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules|build/,
          loader: 'babel-loader?cacheDirectory=true'
        }, {
          test: /\.(ttf|eot|svg|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader'
        }, {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }, {
          test: /\.(png|jpe?g|gif)$/,
          loader: 'url-loader?limit=8192'
        }
      ]
    }
  };
};
