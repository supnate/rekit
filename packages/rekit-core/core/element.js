const _ = require('lodash');
const plugin = require('./plugin');

function add(type, name, args) {
  console.log(`Adding ${type}: `, name);
  execBeforeHooks('add', type, name, args);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.add`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could add an element of type ${type}`);
  thePlugin.elements[type].add(name, args);
  execAfterHooks('add', type, name, args);
}

function move(type, source, target, args) {
  console.log(`Moving ${type}: `, source, target);
  execBeforeHooks('move', type, source, target, args);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.move`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could move element of type ${type}`);
  thePlugin.elements[type].move(source, target, args);
  execAfterHooks('move', type, source, target, args);
}

function remove(type, name, args) {
  console.log(`Removing ${type}: `, name);
  execBeforeHooks('remove', type, name, args);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.remove`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could remove an element of type ${type}`);
  thePlugin.elements[type].remove(name, args);
  execAfterHooks('remove', type, name, args);
}

function update(type, name, args) {
  console.log('updating element: ', type, name, args);
}

function byId(id) {
  return id;
}

function execHooks(beforeAfter, action, type) {
  console.log('exec hooks: ', beforeAfter, action, type);
  const methodName = _.camelCase(`${beforeAfter}-${action}-${type}`);
  const hooksPlugins = plugin.getPlugins(`hooks.${methodName}`);
  console.log('hooks plugins: ', `hooks.${methodName}`, hooksPlugins.length);
  const args = _.toArray(arguments).slice(3);
  hooksPlugins.forEach(p => p.hooks[methodName].apply(p.hook, args));
}

function execBeforeHooks() {
  const args = _.toArray(arguments);
  args.unshift('before');
  execHooks.apply(null, args);
}

function execAfterHooks() {
  const args = _.toArray(arguments);
  args.unshift('after');
  execHooks.apply(null, args);
}

module.exports = {
  add,
  move,
  remove,
  update,
  byId,
};
