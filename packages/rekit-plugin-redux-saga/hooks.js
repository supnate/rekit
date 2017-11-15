'use strict';

// Summary
//  Because redux-saga plugin needs to register middleware in redux store.
//  And needs a root saga entry to collect all sagas from features.
//  So it needs to hook feature management so that imported sagas name could be updated.

const fs = require('fs');
const _ = require('lodash');

module.exports = function (rekitCore) {
  const utils = rekitCore.utils;
  const refactor = rekitCore.refactor;
  const vio = rekitCore.vio;

  function afterAddFeature(featureName) {
    // Summary:
    //  Called after a feature is added. Add sagas.js and add entry in rootSaga.js
    const rootSaga = utils.mapSrcFile('common/rootSaga.js');
    refactor.updateFile(rootSaga, ast => [].concat(
      refactor.addImportFrom(ast, `../features/${_.kebabCase(featureName)}/redux/sagas`, null, null, `${_.camelCase(featureName)}Sagas`),
      refactor.addToArray(ast, 'featureSagas', `${_.camelCase(featureName)}Sagas`)
    ));

    const featureSagas = utils.mapFeatureFile(featureName, 'redux/sagas.js');
    // create sagas.js entry file for the feature
    if (!fs.existsSync(featureSagas)) vio.save(featureSagas, '');
  }

  function afterRemoveFeature(featureName) {
    // Summary:
    //  Called after a feature is removed. Remove entry from rootSaga.js
    const rootSaga = utils.mapSrcFile('common/rootSaga.js');
    refactor.updateFile(rootSaga, ast => [].concat(
      refactor.removeImportBySource(ast, `../features/${_.kebabCase(featureName)}/redux/sagas`),
      refactor.removeFromArray(ast, 'featureSagas', `${_.camelCase(featureName)}Sagas`)
    ));
  }

  function afterMoveFeature(oldName, newName) {
    // Summary:
    //  Called after a feature is renamed. Rename entry in rootSaga.js
    const rootSaga = utils.mapSrcFile('common/rootSaga.js');
    refactor.updateFile(rootSaga, ast => [].concat(
      refactor.renameModuleSource(ast, `../features/${_.kebabCase(oldName)}/redux/sagas`, `../features/${_.kebabCase(newName)}/redux/sagas`),
      refactor.renameImportSpecifier(ast, `${_.camelCase(oldName)}Sagas`, `${_.camelCase(newName)}Sagas`)
    ));
  }

  return {
    afterAddFeature,
    afterRemoveFeature,
    afterMoveFeature,
  };
}
