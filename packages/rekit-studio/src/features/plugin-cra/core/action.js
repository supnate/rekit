const path = require('path');
const entry = require('./entry');
const utils = require('./utils');
const constant = require('./constant');
const { vio, template, refactor } = rekit.core;

function add(elePath, args) {
  if (args.async) return addAsync(elePath, args);
  const ele = utils.parseElePath(elePath, 'action');
  const actionType = utils.getActionType(ele.feature, ele.name);
  const tplFile = './templates/redux/action.js.tpl';
  template.generate(ele.modulePath, {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ ele, actionType }, args.context || {}),
  });

  constant.add(ele.feature, actionType);
  refactor.addExportFrom(`src/features/${ele.feature}/redux/actions.js`, `./${ele.name}`, null, ele.name);
  entry.addToReducer(ele.feature, ele.name);
}

function remove(elePath, args) {
  if (args.async) return removeAsync(elePath, args);
  const ele = utils.parseElePath(elePath, 'action');
  const actionType = utils.getActionType(ele.feature, ele.name);  
  vio.del(ele.modulePath);
  constant.remove(ele.feature, actionType);
  refactor.removeImportBySource(`src/features/${ele.feature}/redux/actions.js`, `./${ele.name}`);
  entry.removeFromReducer(ele.feature, ele.name);
}

function move(source, target, args) {
  if (args.async) return moveAsync(source, target, args);
  console.log('moving action: ', source, target, args);
}

function addAsync(elePath, args) {
  
}
function moveAsync() {}
function removeAsync() {}

module.exports = {
  add,
  move,
  remove,
};
