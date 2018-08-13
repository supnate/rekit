const element = require('./element');

module.exports = function(args) {
  switch (args.commandName) {
    case 'add':
    case 'remove':
      element[args.commandName](args.type, args.name, args);
      break;
    case 'move':
      element.move(args.type, args.source, args.target, args);
      break;
    default:
      console.error('Unknown command: ', args.commandName, args);
      throw new Error(`Unknown command: ${args.commandName}`);
  }
};
