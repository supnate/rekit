'use strict';
//  Summary:
//    Get webpack config for different targets

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const pkgJson = require('./package.json');

module.exports = (type) => { // eslint-disable-line
  // type is one of [dev, dll, test, dist]
  // NOTE: for test, only module property is used.

  const isDev = type === 'dev';
  const isDist = (type === 'dist' || type === 'demo');

  return {
    devtool: {
      dev: 'eval',
      dll: false,
      test: false,
      demo: false,
      dist: 'source-map',
    }[type],
    cache: true,
    context: path.join(__dirname, 'src'),
    performance: {
      hints: false,
      maxEntrypointSize: 250,
      maxAssetSize: 1000,
    },
    entry: {
      dev: {
        main: [
          'react-hot-loader/patch',
          `webpack-hot-middleware/client?http://0.0.0.0:${pkgJson.rekit.devPort}`,
          './styles/index.less',
          './styles/antdCustom.less',
          './index',
        ],
      },
      dll: {
        // Here dll is only used for dev.
        'dev-vendors': [
          'react-hot-loader',
          'babel-polyfill',
          'lodash',
          'react',
          'react-dom',
          'react-router',
          'react-redux',
          'react-router-redux',
          'redux',
          'redux-logger',
          'redux-thunk',
          'antd',
          'axios',
          'reselect',
          'prismjs',
        ],
      },
      dist: {
        main: [
          'babel-polyfill',
          './styles/index.less',
          './styles/antdCustom.less',
          './index'
        ],
      },
      demo: {
        main: [
          'babel-polyfill',
          './styles/index.less',
          './styles/antdCustom.less',
          './index'
        ],
      },
      test: null,
    }[type],

    output: {
      // Js bundle name, [name] will be replaced by which is in entry
      filename: '[name].js',

      // Where to save your build result
      path: path.join(__dirname, 'build/static'),

      // Exposed asset path. NOTE: the end '/' is necessary
      publicPath: '/static/'
    },

    stats: {
      error: true,
    },

    plugins: _.compact([
      isDist && new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      isDev && new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // isDist && new LodashModuleReplacementPlugin({
      //   path: true,
      //   flattening: true,
      // }),
      isDist && new webpack.optimize.UglifyJsPlugin(),
      isDist && new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify({
            demo: 'production',
            dist: 'production',
            dev: 'development',
            test: 'test',
          }[type]),
          REKIT_ENV: JSON.stringify(type),
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
          test: /\.(ttf|eot|svg|woff)$/,
          loader: 'url-loader?limit=1000000' // TODO: it seems only inline base64 font works.
        }, {
          test: /\.less$/,
          loader: isDev ? 'style-loader!css-loader?sourceMap!less-loader?{"sourceMap":true}'
            : 'style-loader!css-loader!less-loader'
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
