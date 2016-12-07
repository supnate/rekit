'use strict';

const path = require('path');
const _ = require('lodash');
const utils = require('../../lib/utils');
const vio = require('../../lib/vio');
const rekit = require('../../lib/rekit');
const refactor = require('../../lib/refactor');
const constant = require('../../lib/constant');
const entry = require('../../lib/entry');
const template = require('../../lib/template');
const action = require('../../lib/action');
const test = require('../../lib/test');

const prjRoot = utils.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

function add(feature, name) {
  feature = _.kebabCase(feature);
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.addAsync(feature, name, {
    templateFile: path.join(pluginRoot, 'templates', 'async_action_saga.js'),
  });

  // Add saga
  const actionTypes = utils.getAsyncActionTypes(feature, name);
  template.create(utils.mapFile(feature, `redux/sagas/${name}.js`), {
    templateFile: path.join(pluginRoot, 'templates', 'saga.js'),
    context: {
      feature,
      actionTypes,
      action: name,
    },
  });

  let targetPath;
  // Add to sagas/index.js
  targetPath = utils.mapFile(feature, 'redux/sagas/index.js');
  refactor.addExportFromLine(targetPath, `export ${name} from './${name}';`);

  // Add saga test
  targetPath = utils.mapTestFile(feature, `redux/${name}.test.js`);
  template.create(targetPath, {
    templateFile: path.join(pluginRoot, 'templates/saga.test.js'),
    context: Object.assign(context, args.context || {}),
  });

  // Add saga test
  targetPath = utils.mapTestFile(feature, `redux/sagas/${name}.test.js`);
  template.create(targetPath, {
    templateFile: path.join(pluginRoot, 'templates/saga.test.js'),
    context: Object.assign(context, args.context || {}),
  });
}


function remove(feature, name) {
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.removeAsync(feature, name);

  // Remove saga
  vio.del(utils.mapFile(feature, `redux/sagas/${_.camelCase(name)}.js`));

  let targetPath;
  // Remove from sagas/index.js
  targetPath = utils.mapFile(feature, 'redux/sagas/index.js');
  refactor.removeExportFromLine(targetPath, `./${name}`);

  // Remove test file
}

function move(feature, name) {

}

module.exports = {
  add,
  remove,
  move,
};
