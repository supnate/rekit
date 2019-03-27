#! /usr/bin/env node
'use strict';

// Summary:
//  Build scalable web applications with React, Redux and React-router.
// Usage:
//  rekit action [...args]
global.__REKIT_NO_CONFIG_WATCH = true;

const ArgumentParser = require('argparse').ArgumentParser;
const rekit = require('rekit-core');
const chalk = require('chalk');
const rekitPkgJson = require('../package.json');

const parser = new ArgumentParser({
  version: rekitPkgJson.version,
  addHelp: true,
  allowAbbrev: false,
  description: 'Rekit command line tools to manage a project.',
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

subparsers.addParser('list', {
  addHelp: true,
  description: 'List supported application types.',
});

createCmd.addArgument('name', {
  help: 'The project name',
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
const uninstallPluginCmd = subparsers.addParser('uninstall', {
  addHelp: true,
  description: 'Uninstall a Rekit plugin.',
});

uninstallPluginCmd.addArgument('name', {
  help: 'The plugin name',
});

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

// TODO: move to rekit-react plugin
addCmd.addArgument(['--connect', '-c'], {
  help: 'Whether to connect to the Redux store. Only used for component.',
  action: 'storeTrue',
});

// TODO: move to rekit-react plugin
addCmd.addArgument(['--url-path', '-u'], {
  help: 'The url path added to react router config. Only used for page/component.',
  dest: 'urlPath',
});

// TODO: move to rekit-react plugin
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
  help: 'The source element to move.',
});

mvCmd.addArgument('target', {
  help: 'The target element to reach.',
});

const args = parser.parseArgs();

// Convert aliases
const aliases = { rm: 'remove', mv: 'move' };
Object.keys(aliases).forEach(k => {
  if (args.commandName === k) {
    args.commandName = aliases[k];
  }
});

console.time('😃  Done');
switch (args.commandName) {
  case 'create':
    // Create a project
    rekit.core.create(args);
    break;
  case 'install':
    rekit.core.plugin.install(args.name);
    break;
  case 'list':
    rekit.core.create.getAppTypes().then(appTypes => {
      console.log(`Found ${appTypes.length} application types supported: `);
      appTypes.forEach((t, i) => {
        console.log(`${i + 1}. ${t.name}${chalk.gray('('+t.id+')')}: ${chalk.cyan(t.description)}`);
      });
      console.timeEnd('😃  Done');
    });
    break;
  case 'uninstall':
    break;
  default:
    rekit.core.handleCommand(args);
    rekit.core.vio.flush();
    console.timeEnd('😃  Done'); // create command doesn't need time end.
    break;
}
