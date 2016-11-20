'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const template = require('./template');

module.exports = {
  add(name) {
    helpers.assertNotEmpty(name);
    const targetDir = path.join(helpers.getProjectRoot(), `src/features/${_.kebabCase(name)}`);
    if (shell.test('-e', targetDir)) {
      helpers.fatalError(`feature already exists: ${_.kebabCase(name)}`);
    }

    vio.mkdir(targetDir);
    vio.mkdir(path.join(targetDir, 'redux'));
    vio.mkdir(path.join(helpers.getProjectRoot(), 'test/app/features', _.kebabCase(name)));
    vio.mkdir(path.join(helpers.getProjectRoot(), 'test/app/features', _.kebabCase(name), 'redux'));

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

    // Create wrapper reducer for the feature
    template.create(path.join(helpers.getProjectRoot(), `test/app/features/${_.kebabCase(name)}/redux/reducer.test.js`), {
      templateFile: 'reducer.test.js',
      context: { feature: name }
    });
  },

  remove(name) {
    vio.del(path.join(helpers.getProjectRoot(), 'src/features', _.kebabCase(name)));
    vio.del(path.join(helpers.getProjectRoot(), 'test/app/features', _.kebabCase(name)));
  },

  move(oldName, newName) {

  },
};
