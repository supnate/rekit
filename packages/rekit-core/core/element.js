const plugin = require('./plugin');
function add(name, args) {
  const plugins = plugin.getPlugins();
}

function move(source, dest, args) {}
function remove(name, args) {}

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
