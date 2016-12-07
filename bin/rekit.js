#! /usr/bin/env node
'use strict';

// Summary:
//  Build scalable web applications with React, Redux and React-router.
// Usage:
//  rekit action [...args]

const ArgumentParser = require('argparse').ArgumentParser;
const rekitPkgJson = require('../package.json');

const parser = new ArgumentParser({
  version: rekitPkgJson.version,
  addHelp: true,
  description: 'Build scalable web applications with React, Redux and React-router.'
});

parser.addArgument('action', {
  help: 'Name of the app.',
});

const args = parser.parseArgs();

console.log(args);

