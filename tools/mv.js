/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Remove a Rekit element.

const vio = require('./lib/vio');
const rekit = require('./lib/rekit');
const ArgumentParser = require('argparse').ArgumentParser;

console.time('✨  Done');

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Move component, page, action, or test for a Rekit project.'
});

parser.addArgument('type', {
  help: 'Type of element to move: one of [feature, component, page, action, async-action, test]',
  metavar: 'type',
  choices: ['feature', 'component', 'page', 'action', 'async-action', 'test'],
});

parser.addArgument('srcName', {
  help: 'Source name of the element.',
});

parser.addArgument('destName', {
  help: 'Destination name of the element.',
});

const res = parser.parseArgs();

let arr = res.srcName.split('/');
const source = {
  feature: arr[0],
  name: arr[1],
};

arr = res.destName.split('/');
const dest = {
  feature: arr[0],
  name: arr[1],
};

switch (res.type) {
  case 'component':
    rekit.moveComponent(source, dest);
    break;
  case 'page':
    rekit.movePage(source, dest);
    break;

  case 'action':
    rekit.moveAction(source, dest);
    break;

  default:
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
