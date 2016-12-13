'use strict';

const path = require('path');
const _ = require('lodash');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
const vio = rekitCore.vio;
const refactor = rekitCore.refactor;
const template = rekitCore.template;
const action = rekitCore.action;

function add(feature, name) {
  const prjRoot = utils.getProjectRoot();
  const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

  feature = _.kebabCase(feature);
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.addAsync(feature, name, {
    templateFile: path.join(pluginRoot, 'templates', 'async_action_saga.js'),
  });

  let targetPath;

  // Add saga
  const actionTypes = utils.getAsyncActionTypes(feature, name);
  targetPath = utils.mapFeatureFile(feature, `redux/sagas/${name}.js`);
  console.log(targetPath);
  template.generate(targetPath, {
    templateFile: path.join(pluginRoot, 'templates', 'saga.js'),
    context: {
      feature,
      actionTypes,
      action: name,
    },
  });

  // Add to sagas/index.js
  targetPath = utils.mapFeatureFile(feature, 'redux/sagas/index.js');
  console.log(targetPath);
  refactor.addExportFromLine(targetPath, `export ${name} from './${name}';`);

  // Add saga test
  targetPath = utils.mapTestFile(feature, `redux/sagas/${name}.test.js`);
  console.log(targetPath);
  template.generate(targetPath, {
    templateFile: path.join(pluginRoot, 'templates/saga.test.js'),
    context: {
      feature,
      action: name,
      actionTypes: utils.getAsyncActionTypes(feature, name),
    },
  });
}


function remove(feature, name) {
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.removeAsync(feature, name);

  // Remove saga
  vio.del(utils.mapFeatureFile(feature, `redux/sagas/${_.camelCase(name)}.js`));

  let targetPath;
  // Remove from sagas/index.js
  targetPath = utils.mapFeatureFile(feature, 'redux/sagas/index.js');
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
