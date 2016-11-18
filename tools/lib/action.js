'use strict';

const _ = require('lodash');
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

  addAsync(feature, name, args) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    const upperSnakeActionName = _.upperSnakeCase(name);

    args = args || {};
    template.create(helpers.getReduxFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'async_action.js',
      context: Object.assign({
        feature,
        action: name,
        CAMEL_ACTION_NAME: _.camelCase(name),
        BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
        SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
        FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
        DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
      }, args.context || {}),
    }));

    constant.add(feature, `${upperSnakeActionName}_BEGIN`);
    constant.add(feature, `${upperSnakeActionName}_SUCCESS`);
    constant.add(feature, `${upperSnakeActionName}_FAILURE`);
    constant.add(feature, `${upperSnakeActionName}_DISMISS_ERROR`);

    entry.addToActions(feature, name);
    entry.addToActions(feature, `dismiss${_.pascalCase(name)}Error`, name);
  },

  removeAsync(feature, name) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    const upperSnakeActionName = _.upperSnakeCase(name);

    inout.del(helpers.getReduxFile(feature, name));
    constant.remove(feature, `${upperSnakeActionName}_BEGIN`);
    constant.remove(feature, `${upperSnakeActionName}_SUCCESS`);
    constant.remove(feature, `${upperSnakeActionName}_FAILURE`);
    constant.remove(feature, `${upperSnakeActionName}_DISMISS_ERROR`);
    entry.removeFromActions(feature, name);
  },
};
