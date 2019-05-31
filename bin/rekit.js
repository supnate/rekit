#! /usr/bin/env node
'use strict';

global.__REKIT_NO_WATCH = true;

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

subparsers.addParser('app-types', {
  addHelp: true,
  description: 'List supported application types.',
});

subparsers.addParser('plugins', {
  addHelp: true,
  description: 'List installed plugins.',
});

createCmd.addArgument('name', {
  help: 'The project name',
});

createCmd.addArgument(['--source', '-s'], {
  help: 'Source template for creating the app. Could be a git repo or local folder.',
  dest: 'source',
});

createCmd.addArgument(['--type', '-t'], {
  help: 'Application type to create, default is rekit-react.',
  defaultValue: 'rekit-react',
});

createCmd.addArgument(['--clean', '-c'], {
  help: 'No example code.',
  action: 'storeTrue',
});

createCmd.addArgument(['--sass'], {
  help: 'Use sass as css transpiler.',
  action: 'storeTrue',
});

// Install plugin command
const installPluginCmd = subparsers.addParser('install', {
  addHelp: true,
  description: 'Install a Rekit plugin.',
});

installPluginCmd.addArgument('name', {
  help: 'The plugin name',
});

installPluginCmd.addArgument(['--registry'], {
  help: 'The npm registry to intall Rekit plugin.',
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

rekit.core.plugin.getPlugins('cli.defineArgs').forEach(p => {
  p.cli.defineArgs({
    parser,
    subparsers,
    addCmd,
    rmCmd,
    mvCmd,
  });
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
    rekit.core.plugin.installPlugin(args.name, args);
    break;
  case 'app-types': {
    const appTypes = rekit.core.app.getAppTypes();
    console.log(`Found ${appTypes.length} application types supported: `);
    console.log();
    appTypes.forEach((t, i) => {
      console.log(
        `  ${i + 1}. ${t.name}${chalk.gray('(' + t.id + ')')}${
          t.disabled ? chalk.red('[disabled]') : ''
        }: ${chalk.cyan(t.description)}`,
      );
    });
    console.log();
    break;
  }
  case 'plugins': {
    const plugins = rekit.core.plugin.getInstalledPlugins();
    console.log(`Found ${plugins.length} plugins installed. `);
    console.log();
    plugins.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} ${chalk.cyan(p.version ? p.version : ' built-in')}`);
    });
    console.log();
    break;
  }
  case 'uninstall':
    rekit.core.plugin.uninstallPlugin(args.name);
    break;
  default:
    rekit.core.handleCommand(args);
    rekit.core.vio.flush();
    console.timeEnd('😃  Done'); // create command doesn't need time end.
    break;
}
