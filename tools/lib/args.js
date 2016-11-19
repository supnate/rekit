'use strict';

// Summary:
//  Parse args for Rekit command line tools.

const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Create component, page, action, or test for a Rekit project.'
});

parser.addArgument('type', {
  help: 'Type of element to create: one of [feature, component, page, action, async-action, test]',
  metavar: 'type',
  choices: ['feature', 'component', 'page', 'action', 'async-action', 'test'],
});

parser.addArgument('name', {
  help: 'Name of the element.',
});

parser.addArgument(['-u', '--url-path'], {
  help: 'Url path for page, defaults to kebab case of the page name, e.g., page-name.',
  dest: 'urlPath',
  metavar: 'urlPath',
});

parser.addArgument(['-t', '--action-type'], {
  help: 'Action type for sync action, defaults to upper snake case of the action name, e.g., ACTION_NAME.',
  dest: 'actionType',
  metavar: 'actionType',
});

const res = parser.parseArgs();

const arr = res.name.split('/');
res.feature = arr[0];
res.name = arr[1];

module.exports = res;
