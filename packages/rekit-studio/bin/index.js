#! /usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const path = require('path');
const rekit = require('rekit-core');
const pkgJson = require('../package.json');
const start = require('../lib/start');

const parser = new ArgumentParser({
  version: pkgJson.version,
  addHelp: true,
  allowAbbrev: false,
  description: 'Start Rekit Studio with given port and project dir.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
  defaultValue: 6076,
});

parser.addArgument(['--dir', '-d'], {
  help: 'The project dir loaded by Rekit Studio.',
  defaultValue: '.',
});

const args = parser.parseArgs();

const prjRoot = path.isAbsolute(args.dir) ? args.dir : path.join(process.cwd(), args.dir);
rekit.core.paths.setProjectRoot(prjRoot);

start({ projectRoot: prjRoot, port: args.port });
