'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const vio = require('./vio');

module.exports = {
  add(feature, component, urlPath) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(component, 'component name');
    helpers.assertFeatureExist(feature);

    urlPath = urlPath || _.kebabCase(component);
    const targetPath = helpers.mapFile(feature, 'route.js');
    const lines = vio.getLines(targetPath);
    let i = helpers.lineIndex(lines, '} from \'./index\';');
    lines.splice(i, 0, `  ${helpers.pascalCase(component)},`);
    i = helpers.lineIndex(lines, 'path: \'*\'');
    if (i === -1) {
      i = helpers.lastLineIndex(lines, /^ {2}]/);
    }
    lines.splice(i, 0, `    { path: '${urlPath}', component: ${helpers.pascalCase(component)} },`);
    vio.save(targetPath, lines);
  },

  remove(feature, component) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(component, 'component name');
    helpers.assertFeatureExist(feature);

    const targetPath = helpers.mapFile(feature, 'route.js');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `  ${helpers.pascalCase(component)},`);
    helpers.removeLines(lines, `component: ${helpers.pascalCase(component)} }`);
    vio.save(targetPath, lines);
  },

  addRootEntry(feature) {

  },

  removeRootEntry(feature) {

  },
};
