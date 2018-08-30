const _ = require('lodash');
const plugin = require('./plugin');

function add(type, name, args) {
  console.log('Adding element: ', `[${type}]`, name);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.add`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could add an element of type ${type}`);
  return thePlugin.elements[type].add(name, args);
}
function move(type, source, target, args) {
  console.log('Moving element: ', `[${type}]`, source, target);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.move`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could move element of type ${type}`);
  return thePlugin.elements[type].move(type, source, target, args);
}
function remove(type, name, args) {
  console.log('Removing element: ', `[${type}]`, name);
  const thePlugin = _.last(plugin.getPlugins(`elements.${type}.remove`));
  if (!thePlugin) throw new Error(`Can't find a plugin which could remove an element of type ${type}`);
  return thePlugin.elements[type].remove(name, args);
}

function update(type, name, args) {
  console.log('updating element: ', type, name, args);
}

function byId(id) {
  return id;
}

module.exports = {
  add,
  move,
  remove,
  update,
  byId,
};
// function handleAction(args) {
//   const params = [];
//   switch (args.action) {
//     case 'add':
//     case 'remove': {
//       if (args.type === 'feature') params.push(args.name);
//       else {
//         params.push(splitName(args.name).feature);
//         params.push(splitName(args.name).name);
//       }
//       break;
//     }
//     case 'move': {
//       if (args.type === 'feature') {
//         params.push(args.source);
//         params.push(args.target);
//       } else {
//         params.push(splitName(args.source));
//         params.push(splitName(args.target));
//       }
//       break;
//     }
//     default:
//       break;
//   }
//   params.push(args);

//   let cmd = plugin.getCommand(args.commandName, args.type);
//   if (!cmd) {
//     cmd = coreCommands[_.camelCase(args.commandName + '-' + args.type)];
//   }

//   if (!cmd) {
//     utils.fatalError(`Can't find the desired command: ${args.commandName}`);
//   }
//   cmd.apply(null, params);
// }
