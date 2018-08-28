const paths = require('./paths');

const commonDll = [
  'antd',
  'antd/dist/antd.less',
  'axios',
  'ansi-to-html',
  'babel-polyfill',
  'classnames',
  'd3',
  'fuzzysort',
  'history',
  'immutability-helper',
  'lodash/lodash',
  'monaco-editor',
  'react',
  'react-dom',
  'react-router-dom',
  'react-redux',
  'react-router-redux',
  'react-beautiful-dnd',
  'react-split-pane',
  'redux',
  'redux-logger',
  'reselect',
  'redux-thunk',
  'semver',
  'socket.io-client',
  'tinygradient',
];
module.exports = {
  'dev-dll': ['react-hot-loader', ...commonDll],
  'prod-dll': [...commonDll],
};
