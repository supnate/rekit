const paths = require('./paths');

const commonDll = [
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
];
module.exports = {
  'dev-dll': ['react-hot-loader', ...commonDll],
  'prod-dll': [...commonDll],
};
