const path = require('path');
const _ = require('lodash');
const entry = require('./entry');
const route = require('./route');
const style = require('./style');

const { vio, template, paths } = rekit.core;

_.pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);
_.upperSnakeCase = _.flow(
  _.snakeCase,
  _.toUpper
);

function add(elePath, args) {
  const { connected, urlPath } = args;
  const arr = elePath.split('/');
  const name = _.pascalCase(arr.pop());
  const prefix = arr.join('-');

  const targetPath = `src/features/${arr.join('/')}/${name}.js`;
  const tplFile = connected ? './templates/ConnectedComponent.js.tpl' : './templates/Component.js.tpl';
  template.generate(targetPath, {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ prefix, targetPath, name }, args.context || {}),
  });

  // Add style file
  style.add(elePath, args);

  // Add to index.s in the same folder, should this be optional?
  entry.addToIndex(targetPath, args);

  if (urlPath) {
    // Add to route.js if urlPath exists
    // route.add(targetPath, args);
  }
}

function remove(elePath, args) {
  // Remove component module
  const arr = elePath.split('/');
  const name = _.pascalCase(arr.pop());

  const targetPath = `src/features/${arr.join('/')}/${name}.js`;
  vio.del(targetPath);

  // Remove style file
  style.remove(elePath, args);

  // Remove from index.js
  entry.removeFromIndex(targetPath, args);
}

function move(source, target, args) {
  console.log('moving component: ', source, target, args);
}

module.exports = {
  add,
  remove,
  move,
};
