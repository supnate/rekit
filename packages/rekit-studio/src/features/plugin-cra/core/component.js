const path = require('path');
const _ = require('lodash');
const entry = require('./entry');
const route = require('./route');
const style = require('./style');
const utils = require('./utils');

const { vio, template, paths } = rekit.core;

_.pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);
_.upperSnakeCase = _.flow(
  _.snakeCase,
  _.toUpper
);

// Add a component
// elePath format: home/MyComponent, home/subFolder/MyComponent
function add(elePath, args) {
  const { connected, urlPath } = args;
  const ele = utils.parseElePath(elePath, 'component');

  const tplFile = connected ? './templates/ConnectedComponent.js.tpl' : './templates/Component.js.tpl';
  template.generate(ele.modulePath, {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ ele }, args.context || {}),
  });

  // Add style file
  style.add(ele.path, args);

  // Add to index.s in the same folder, should this be optional?
  entry.addToIndex(ele.path, args);

  if (urlPath) {
    // Add to route.js if urlPath exists
    route.add(ele.path, args);
  }
}

function remove(elePath, args) {
  // Remove component module
  const ele = utils.parseElePath(elePath, 'component');
  vio.del(ele.modulePath);

  // Remove style file
  style.remove(ele.path, args);

  // Remove from index.js
  entry.removeFromIndex(ele.path, args);
}

function move(source, target, args) {
  console.log('moving component: ', source, target, args);
}

module.exports = {
  add,
  remove,
  move,
};
