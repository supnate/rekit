const _ = require('lodash');
const entry = require('./entry');
const utils = require('./utils');

const { vio, refactor, config, template } = rekit.core;
const { getTplPath } = utils;

function add(feature) {
  feature = _.kebabCase(feature);
  const targetDir = `src/features/${feature}`;
  if (vio.dirExists(targetDir)) throw new Error('Feature folder has been existed: ' + targetDir);

  vio.mkdir(targetDir);
  vio.mkdir(`${targetDir}/redux`);
  vio.mkdir(`tests/features/${feature}`);
  vio.mkdir(`tests/features/${feature}/redux`);

  // Create files from template
  [
    'index.js',
    'route.js',
    'style.' + config.style,
    'redux/actions.js',
    'redux/reducer.js',
    'redux/constants.js',
    'redux/initialState.js',
  ].forEach((fileName) => {
    template.generate(`src/features/${feature}/${fileName}`, {
      templateFile: getTplPath(fileName + '.tpl'),
      context: { feature }
    });
  });

  // Create wrapper reducer for the feature
  // template.generate(utils.joinPath(utils.getProjectRoot(), `tests/features/${name}/redux/reducer.test.js`), {
  //   templateFile: 'redux/reducer.test.js',
  //   context: { feature: name }
  // });

  entry.addToRootReducer(feature);
  entry.addToRouteConfig(feature);
  entry.addToRootStyle(feature);
}

function move(oldName, newName) {
  // const targetPath = `src/features/${feature}/redux/constants.js`;
  // const lines = vio.getLines(targetPath);
  // const i = refactor.lineIndex(lines, `export const ${oldName} = '${oldName}';`);
  // if (i >= 0) {
  //   lines[i] = `export const ${newName} = '${newName}';`;
  // }

  // vio.save(targetPath, lines);
}

function remove(feature) {
  feature = _.kebabCase(feature);
  vio.del(`src/features/${feature}`);
  vio.del(`tests/features/${feature}`);

  entry.removeFromRootReducer(feature);
  entry.removeFromRouteConfig(feature);
  entry.removeFromRootStyle(feature);
}

module.exports = {
  add,
  remove,
  move,
};
