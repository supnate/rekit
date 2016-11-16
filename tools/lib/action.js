'use strict';

const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const inout = require('./inout');
const template = require('./template');
const constant = require('./constant');
const entry = require('./entry');

module.exports = {
  add(feature, name, args) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    // create component from template
    args = args || {};
    const actionType = args.actionType || name;
    template.create(helpers.getReduxFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'action.js',
      context: Object.assign({
        feature,
        actionType,
        action: name,
      }, args.context || {}),
    }));

    constant.add(feature, actionType);
    entry.addToActions(feature, name);
  },

  remove(feature, name, actionType) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    actionType = actionType || name;
    inout.del(helpers.getReduxFile(feature, name));
    constant.remove(feature, actionType);
    entry.removeFromActions(feature, name);
  },

  addAsync(feature, name) {

  },

  removeAsync(feature, name) {

  },
};


