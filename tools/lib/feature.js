'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const refactor = require('./refactor');
const entry = require('./entry');
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
    // Summary:
    //  Move or rename a feature. Seems very heavy.
    helpers.assertNotEmpty(oldName);
    helpers.assertNotEmpty(newName);
    helpers.assertFeatureExist(oldName);
    helpers.assertFeatureNotExist(newName);

    oldName = _.kebabCase(oldName);
    newName = _.kebabCase(newName);

    const prjRoot = helpers.getProjectRoot();

    // Move feature folder
    const oldFolder = path.join(prjRoot, 'src/features', oldName);
    const newFolder = path.join(prjRoot, 'src/features', newName);
    console.log('Moved: ', oldFolder.replace(prjRoot, ''), 'to', newFolder.replace(prjRoot, ''));
    shell.mv(oldFolder, newFolder);

    // Move feature test folder
    const oldTestFolder = path.join(prjRoot, 'test/app/features', oldName);
    const newTestFolder = path.join(prjRoot, 'test/app/features', newName);
    console.log('Moved: ', oldTestFolder.replace(prjRoot, ''), 'to', newTestFolder.replace(prjRoot, ''));
    shell.mv(oldTestFolder, newTestFolder);

    // Update common/routeConfig
    entry.renameInRouteConfig(oldName, newName);

    // Update common/rootReducer
    entry.renameInRootReducer(oldName, newName);

    // Update styles/index.less
    entry.renameInRootStyle(oldName, newName);

    // Update feature/route.js for path and name if they bind to feature name
    refactor.updateFile(helpers.mapFile(newName, 'route.js'), ast => [].concat(
      refactor.renameStringLiteral(ast, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
      refactor.renameStringLiteral(ast, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
    ));

    // Try to rename css class names for components/pages
    const folder = path.join(prjRoot, 'src/features', newName);
    shell.ls(folder)
      .filter(f => /^[A-Z]/.test(path.basename(f)))
      .forEach((filePath) => {
        const moduleName = path.basename(filePath).split('.')[0];
        const absPath = path.join(folder, filePath);
        if (/\.js$/.test(filePath)) {
          // For components, update the css class name inside
          refactor.updateFile(absPath, ast => [].concat(
            refactor.renameStringLiteral(ast, `${oldName}-${_.kebabCase(moduleName)}`, `${newName}-${_.kebabCase(moduleName)}`) // rename css class name
          ));
        } else if (/\.less$/.test(filePath)) {
          // For style update
          let lines = vio.getLines(absPath);
          const oldCssClass = `${oldName}-${_.kebabCase(moduleName)}`;
          const newCssClass = `${newName}-${_.kebabCase(moduleName)}`;

          lines = lines.map(line => line.replace(`.${oldCssClass}`, `.${newCssClass}`));
          vio.save(absPath, lines);
        }
      });

    // Try to do a rougth string replacement based on the original generated code structure
    const testFolder = path.join(prjRoot, 'test/app/features', newName);
    shell.ls('-R', testFolder)
      .filter(f => /\.test\.js$/.test(f))
      .forEach((filePath) => {
        const moduleName = path.basename(filePath).replace('.test.js', '');
        refactor.updateFile(path.join(testFolder, filePath), ast => [].concat(
          refactor.renameStringLiteral(ast, `src/features/${oldName}`, `src/features/${newName}`), // import module path
          refactor.renameStringLiteral(ast, `src/features/${oldName}/${moduleName}`, `src/features/${newName}/${moduleName}`), // import module path
          refactor.renameStringLiteral(ast, `src/features/${oldName}/redux/reducer`, `src/features/${newName}/redux/reducer`), // import module path
          refactor.renameStringLiteral(ast, `src/features/${oldName}/redux/constants`, `src/features/${newName}/redux/constants`), // import module path
          refactor.renameStringLiteral(ast, `src/features/${oldName}/redux/${moduleName}`, `src/features/${newName}/redux/${moduleName}`), // import module path
          refactor.renameStringLiteral(ast, `${oldName}/${moduleName}`, `${newName}/${moduleName}`), // describe component/page test
          refactor.renameStringLiteral(ast, `${oldName}/redux/${moduleName}`, `${newName}/redux/${moduleName}`), // describe action test
          refactor.renameStringLiteral(ast, `${oldName}/redux/reducer`, `${newName}/redux/reducer`), // describe reducer test
          refactor.renameStringLiteral(ast, `.${oldName}-${_.kebabCase(moduleName)}`, `.${newName}-${_.kebabCase(moduleName)}`) // root css class name
        ));
      });
  },
};
