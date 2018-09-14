'use strict';
// require('rekit-core').core.paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode/');
require('rekit-core').core.paths.setProjectRoot('/Users/pwang7/workspace/serenity/');
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
console.time('loading modules...');
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const ArgumentParser = require('argparse').ArgumentParser;
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');

const startDevServer = require('./startDevServer');
// const startRekitStudio = require('./startRekitStudio');
const parser = new ArgumentParser({
  addHelp: true,
  description: 'Start express server for dev or build result.',
});

parser.addArgument(['--readonly'], {
  help: 'Whether build server server is readonly',
  action: 'storeTrue',
});

const args = parser.parseArgs();

const useYarn = fs.existsSync(paths.yarnLockFile);
process.stdout.isTTY = false;
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs, paths.appIndexStyle])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT =
  parseInt(process.env.PORT, 10) || require(paths.appPackageJson).rekit.devPort || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`);
  console.log();
}
console.timeEnd('loading modules...');

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `choosePort()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    startDevServer(port);
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
      console.log(err.stack);
    }
    process.exit(1);
  });
