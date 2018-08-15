const path = require('path');
const entry = require('./entry');
const route = require('./route');
const style = require('./style');
const utils = require('./utils');

const { vio, template } = rekit.core;

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

  style.add(ele.path, args);
  entry.addToIndex(ele.path, args);
  if (urlPath) {
    route.add(ele.path, args);
  }
}

function remove(elePath, args) {
  // Remove component module
  const ele = utils.parseElePath(elePath, 'component');
  vio.del(ele.modulePath);

  style.remove(ele.path, args);
  entry.removeFromIndex(ele.path, args);
  route.remove(ele.path, args);
}

function move(source, target, args) {
  console.log('moving component: ', source, target, args);
}

module.exports = {
  add,
  remove,
  move,
};
