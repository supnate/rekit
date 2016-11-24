'use strict';

const path = require('path');
const shell = require('shelljs');
const crypto = require('crypto');
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
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
  choices: ['dev', 'build'],
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

  app.get('*', (req, res) => {
    console.log('req: ', req.path);
    // res.sendFile(express.static(req.path));
    res.sendFile(path.join(__dirname, '../src/index.html'));
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
  app.listen(pkgJson.rekit.buildPort, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`Listening at http://localhost:${pkgJson.rekit.buildPort}/`);
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
  console.log('dll name: ', dllName);

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
  console.log('vendors dll is up to date, no need to rebuild.');
  return Promise.resolve();
}

switch (args.mode) {
  case 'build':
    startBuildServer();
    break;

  default:
    buildDevDll().then(startDevServer);
}
