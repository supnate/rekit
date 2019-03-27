#! /usr/bin/env node
'use strict';

// Summary:
//  Build scalable web applications with React, Redux and React-router.
// Usage:
//  rekit action [...args]
global.__REKIT_NO_CONFIG_WATCH = true;

const path = require('path');
const fs = require('fs');
const resolveCwd = require('resolve-cwd');
const ArgumentParser = require('argparse').ArgumentParser;
const rekitPkgJson = require('../package.json');
const createApp = require('./createApp');
const createPlugin = require('./createPlugin');
const installPlugin = require('./installPlugin');

const parser = new ArgumentParser({
  version: rekitPkgJson.version,
  addHelp: true,
  allowAbbrev: false,
  description: 'Build scalable web applications with React, Redux and React-router.',
});

const subparsers = parser.addSubparsers({
  title: 'Sub commands',
  dest: 'commandName',
});

// Create project
const createCmd = subparsers.addParser('create', {
  addHelp: true,
  description: 'Create a new Rekit project.',
});

const listCmd = subparsers.addParser('list', {
  addHelp: true,
  description: 'List supported application types.',
});

createCmd.addArgument('name', {
  help: 'The project name',
});

createCmd.addArgument(['--sass'], {
  help: 'Use sass rather than less.',
  action: 'storeTrue',
});

createCmd.addArgument(['--source', '-s'], {
  help: 'Source for creating the project.',
});

createCmd.addArgument(['--clean', '-c'], {
  help: 'Create a clean app without sample actions/pages.',
  action: 'storeTrue',
});

createCmd.addArgument(['--type', '-t'], {
  help: 'Which type of the application to create.',
  defaultValue: 'rekit-react',
});

const createPluginCmd = subparsers.addParser('create-plugin', {
  addHelp: true,
  description:
    'Create a Rekit plugin. If under a Rekit project, create a local plugin; otherwise create a plugin as a npm package.',
});

createPluginCmd.addArgument('name', {
  help: 'The plugin name',
});

// Install plugin command
const installPluginCmd = subparsers.addParser('install', {
  addHelp: true,
  description: 'Install a Rekit plugin.',
});

installPluginCmd.addArgument('name', {
  help: 'The plugin name',
});

// Uninstall plugin command
// const uninstallPluginCmd = subparsers.addParser('uninstall', {
//   addHelp: true,
//   description: 'Uninstall a Rekit plugin.',
// });

// uninstallPluginCmd.addArgument('name', {
//   help: 'The plugin name',
// });

// Add sub-command
const addCmd = subparsers.addParser('add', {
  addHelp: true,
  description: 'Add an element to the project.',
});

addCmd.addArgument('type', {
  help: 'The type of the element to add.',
});

addCmd.addArgument('name', {
  help:
    "The element name to add, in format of <feature>/<name>, e.g.: 'rekit add component user/list-view'. <name> is unnecessary if add a feature.",
});

addCmd.addArgument(['--connect', '-c'], {
  help: 'Whether to connect to the Redux store. Only used for component.',
  action: 'storeTrue',
});

addCmd.addArgument(['--url-path', '-u'], {
  help: 'The url path added to react router config. Only used for page/component.',
  dest: 'urlPath',
});

addCmd.addArgument(['--async', '-a'], {
  help: 'Whether the action is async using redux-thunk.',
  action: 'storeTrue',
});

// Remove sub-command
const rmCmd = subparsers.addParser('remove', {
  aliases: ['rm'],
  addHelp: true,
  description: 'Remove an element from the project.',
});

rmCmd.addArgument('type', {
  help: 'The type of the element to remove.',
});

rmCmd.addArgument('name', {
  help:
    "The element name to remove, in format of <feature>/<name>, e.g.: 'rekit remove component user/list-view'. Name is unnecessary if remove a feature.",
});

// Move sub-command
const mvCmd = subparsers.addParser('move', {
  aliases: ['mv'],
  addHelp: true,
  description: 'Move or rename an element.',
});

mvCmd.addArgument('type', {
  help: 'The type of the element to move.',
});

mvCmd.addArgument('source', {
  help:
    "The source element to move, in format of <feature>/<name>, e.g.: 'rekit move component user/list-view employee/list'. Name is unnecessary if move a feature.",
});

mvCmd.addArgument('target', {
  help:
    "The target element to reach, in format of <feature>/<name>, e.g.: 'rekit move component user/list-view employee/list'. Name is unnecessary if move a feature.",
});

const args = parser.parseArgs();

console.time('😃  Done');
// Convert aliases
const aliases = { rm: 'remove', mv: 'move' };
Object.keys(aliases).forEach(k => {
  if (args.commandName === k) {
    args.commandName = aliases[k];
  }
});
const rekit = require('rekit-core');
console.log('rekitcore:', require.resolve('rekit-core'));
switch (args.commandName) {
  case 'create':
    // Only create command is handled rekit
    rekit.core.create(args);
    break;
  case 'list':
    //
    break;
  case 'create-plugin':
    createPlugin(args, rekit);
    console.timeEnd('😃  Done'); // create command doesn't need time end.
    break;
  case 'install':
    installPlugin(args, rekit);
    break;
  case 'uninstall':
    break;
  default:
    // Other command are handled by rekit-core
    if (!rekit) {
      console.log('Error: please ensure rekit-core is installed for the project.');
      process.exit(1);
    }
    rekit.core.handleCommand(args);
    rekit.core.vio.flush();
    console.timeEnd('😃  Done'); // create command doesn't need time end.
    break;
}
