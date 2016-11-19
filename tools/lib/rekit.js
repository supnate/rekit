'use strict';

// Summary
//  CLI wrapper for managing Rekit elements.

const component = require('./component');
const style = require('./style');
const test = require('./test');
const action = require('./action');
const featureMgr = require('./feature');
const entry = require('./entry');

module.exports = {
  addComponent(feature, name) {
    component.add(feature, name);
    style.add(feature, name);
    test.add(feature, name);
  },

  removeComponent(feature, name) {
    component.remove(feature, name);
    style.remove(feature, name);
    test.remove(feature, name);
  },

  addPage(feature, name, urlPath) {
    component.add(feature, name, { templateFile: 'Page.js' });
    entry.addToRoute(feature, name, urlPath);
    style.add(feature, name);
    test.add(feature, name, { templateFile: 'Page.test.js' });
  },

  removePage(feature, name, urlPath) {
    component.remove(feature, name);
    entry.removeFromRoute(feature, name, urlPath);
    style.remove(feature, name);
    test.remove(feature, name);
  },

  addAction(feature, name, actionType) {
    action.add(feature, name, { actionType });
    test.addAction(feature, name, { actionType });
  },

  removeAction(feature, name, actionType) {
    action.remove(feature, name, actionType);
    test.removeAction(feature, name);
  },

  addAsyncAction(feature, name) {
    action.addAsync(feature, name);
    test.addAction(feature, name, { isAsync: true });
  },

  removeAsyncAction(feature, name) {
    action.removeAsync(feature, name);
    test.removeAction(feature, name);
  },

  addFeature(name) {
    featureMgr.add(name);
    entry.addToRootReducer(name);
    entry.addToRouteConfig(name);
    entry.addToRootStyle(name);
  },

  removeFeature(name) {
    featureMgr.remove(name);
    entry.removeFromRootReducer(name);
    entry.removeFromRouteConfig(name);
    entry.removeFromRootStyle(name);
  },
};

