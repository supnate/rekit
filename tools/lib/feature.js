'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const template = require('./template');
const page = require('./page');
const action = require('./action');
const entry = require('./entry');

module.exports = {
  add(name) {
    helpers.assertNotEmpty(name);
    const targetDir = path.join(helpers.getProjectRoot(), `src/features/${_.kebabCase(name)}`);
    if (shell.test('-e', targetDir)) {
      helpers.fatalError(`feature already exists: ${_.kebabCase(name)}`);
    }

    vio.mkdir(targetDir);
    vio.mkdir(path.join(targetDir, 'redux'));

    // Create files from template
    [
      'index.js',
      'route.js',
      'selectors.js',
      'style.less',
      'redux/actions.js',
      'redux/reducer.js',
      'redux/constants.js',
      'redux/initialState.js',
    ].forEach((fileName) => {
      template.create(path.join(targetDir, fileName), {
        templateFile: fileName,
        context: { feature: name }
      });
    });
  },

  remove(name) {

  },

  move(oldName, newName) {

  },
};