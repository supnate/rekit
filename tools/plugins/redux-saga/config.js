'use strict';

// Summary:
//  Entrance of the plugin.

module.exports = {
  name: 'saga',
  accept: ['async-action-saga saga'],
  dependencies: ['redux-saga'],
};
