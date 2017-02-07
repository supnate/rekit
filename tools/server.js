'use strict';

// Summary:
//  This script is used to start dev server, build result server and rekit portal.
//  Feel free to edit it to meet your specific requirement since this file has been copied to your project.

const path = require('path');
const http = require('http');
const shell = require('shelljs');
const crypto = require('crypto');
const express = require('express');
const fallback = require('express-history-api-fallback');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const rekitPortalMiddleWare = require('rekit-portal/middleware');
const pkgJson = require('../package.json');
const getConfig = require('../webpack-config');
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Start an express server for webpack dev or build result.',
});

parser.addArgument(['-m', '--mode'], {
  help: 'Server mode, dev or build.',
  metavar: 'mode',
  choices: ['dev', 'build', 'portal'],
});

const args = parser.parseArgs();

const srcPath = path.join(__dirname, '../src');
const manifestPath = path.join(__dirname, '../.tmp/dev-vendors-manifest.json');


// Start an express server for development using webpack dev-middleware and hot-middleware
function startDevServer() {
  const app = express();
  const devConfig = getConfig('dev');

  devConfig.plugins.push(new webpack.DllReferencePlugin({
    context: srcPath,
    manifest: require(manifestPath),
  }));

  const compiler = webpack(devConfig);
  app.use(devMiddleware(compiler, {
    publicPath: devConfig.output.publicPath,
    historyApiFallback: true,
  }));

  app.use(hotMiddleware(compiler));

  // First, find files from src folder
  app.use(express.static(path.join(__dirname, '../src')));

  // Also support files from root folder, mainly for the dev-vendor bundle
  app.use(express.static(path.join(__dirname, '../')));

  // History api fallback
  app.use(fallback('index.html', { root: path.join(__dirname, '../src') }));

  // Other files should not happen, respond 404
  app.get('*', (req, res) => {
    console.log('Warning: unknown req: ', req.path);
    res.sendStatus(404);
  });

  app.listen(pkgJson.rekit.devPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`Listening at http://localhost:${pkgJson.rekit.devPort}/`);
  });
}

// Start an express server for build result.
function startBuildServer() {
  const app = express();
  const root = path.join(__dirname, '../build');
  app.use(express.static(root));
  app.use(fallback('index.html', { root }));

  // Other files should not happen, respond 404
  app.get('*', (req, res) => {
    console.log('Warning: unknown req: ', req.path);
    res.sendStatus(404);
  });

  app.listen(pkgJson.rekit.buildPort, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`Listening at http://localhost:${pkgJson.rekit.buildPort}/`);
  });
}

// Start an express server for rekit-portal.
function startPortalServer() {
  console.log('starting rekit portal...');
  const app = express();
  const server = http.createServer(app);
  const root = path.join(__dirname, '../node_modules/rekit-portal/dist');
  app.use(rekitPortalMiddleWare()(server, app));
  app.use(express.static(root));
  app.use(fallback('index.html', { root }));

  // Other files should not happen, respond 404
  app.get('*', (req, res) => {
    console.log('Warning: unknown req: ', req.path);
    res.sendStatus(404);
  });

  const port = pkgJson.rekit.portalPort;
  server.listen(port, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`The rekit portal server is listening at http://localhost:${port}/`);
  });
}

// Build dll to accerlarate webpack build performance for dev-time.
function buildDevDll() {
  const dllConfig = getConfig('dll');

  // Get snapshot hash for all dll entries versions.
  const nameVersions = dllConfig.entry['dev-vendors'].map((pkgName) => {
    const pkg = require(path.join(pkgName.split('/')[0], 'package.json'));
    return `${pkg.name}_${pkg.version}`;
  }).join('-');

  const dllHash = crypto
    .createHash('md5')
    .update(nameVersions)
    .digest('hex');
  const dllName = `devVendors_${dllHash}`;

  // If dll doesn't exist or version changed, then rebuild it
  if (
    !shell.test('-e', manifestPath)
    || require(manifestPath).name !== dllName
  ) {
    delete require.cache[manifestPath]; // force reload the new manifest
    console.log('Dev vendors have changed, rebuilding dll...');
    console.time('Dll build success');

    dllConfig.output.library = dllName;
    dllConfig.output.path = path.join(__dirname, '../.tmp');
    dllConfig.plugins.push(new webpack.DllPlugin({
      path: manifestPath,
      name: dllName,
      context: srcPath,
    }));

    return new Promise((resolve, reject) => {
      webpack(dllConfig, (err) => {
        if (err) {
          console.log('dll build failed:');
          console.log(err.stack || err);
          reject();
          return;
        }
        console.timeEnd('Dll build success');
        resolve();
      });
    });
  }
  console.log('The dev-vendors bundle is up to date, no need to rebuild.');
  return Promise.resolve();
}

if (!args.mode || args.mode === 'build') startBuildServer();
if (!args.mode || args.mode === 'dev') buildDevDll().then(startDevServer);
if (!args.mode || args.mode === 'portal') startPortalServer();
