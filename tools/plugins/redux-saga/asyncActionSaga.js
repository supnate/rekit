'use strict';

const path = require('path');
const _ = require('lodash');
const helpers = require('../../lib/helpers');
const vio = require('../../lib/vio');
const rekit = require('../../lib/rekit');
const refactor = require('../../lib/refactor');
const constant = require('../../lib/constant');
const entry = require('../../lib/entry');
const template = require('../../lib/template');
const action = require('../../lib/action');
const test = require('../../lib/test');

const prjRoot = helpers.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

function add(feature, name) {
  feature = _.kebabCase(feature);
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.addAsync(feature, name, {
    templateFile: path.join(pluginRoot, 'templates', 'async_action_saga.js'),
  });

  // Add saga
  const actionTypes = helpers.getAsyncActionTypes(feature, name);
  template.create(helpers.mapFile(feature, `redux/sagas/${name}.js`), {
    templateFile: path.join(pluginRoot, 'templates', 'saga.js'),
    context: {
      feature,
      actionTypes,
      action: name,
    },
  });

  let targetPath;
  // Add to sagas/index.js
  targetPath = helpers.mapFile(feature, 'redux/sagas/index.js');
  refactor.addExportFromLine(targetPath, `export ${name} from './${name}';`);

  // Add saga ref to common/rootSaga.js
  targetPath = path.join(prjRoot, 'src/common/rootSaga.js');
  refactor.addImportLine(targetPath, `import * as ${name}Sagas from '../features/${feature}/redux/sagas';`);
  const lines = vio.getLines(targetPath);
  const i = refactor.lineIndex(lines, '].reduce', 'const sagas = [');
  lines.splice(i, 0, `  ${name}Sagas,`);

  vio.save(targetPath, lines);

  // Add saga test
}


function remove(feature, name) {
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.removeAsync(feature, name);

  // Remove saga
  vio.del(helpers.mapFile(feature, `redux/sagas/${_.camelCase(name)}.js`));

  let targetPath;
  // Remove from sagas/index.js
  targetPath = helpers.mapFile(feature, 'redux/sagas/index.js');
  refactor.removeExportFromLine(targetPath, `./${name}`);

  // Remove from common/rootSaga.js
  targetPath = path.join(prjRoot, 'src/common/rootSaga.js');
  refactor.removeImportLine(targetPath, `../features/${feature}/redux/sagas`);
  const lines = vio.getLines(targetPath);
  refactor.removeLines(lines, `  ${name}Sagas,`);

  vio.save(targetPath, lines);
}

function move(feature, name) {

}

module.exports = {
  add,
  remove,
  move,
};
