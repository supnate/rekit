'use strict';

// Summary:
//  Create a new project.

const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const request = require('request');
const rekitPkgJson = require('../package.json');

function create(args) {
  const prjName = args.name;
  if (!prjName) {
    console.log('Error: please specify the project name.');
    process.exit(1);
  }

  // The created project dir
  const prjPath = path.join(process.cwd(), prjName);
  if (shell.test('-e', prjPath)) {
    console.log(`Error: target folder already exists: ${prjPath}`);
    process.exit(1);
  }
  console.log('Welcome to Rekit, now creating your project...');
  shell.mkdir(prjPath);

  // Rekit CLI itself.
  const rekitRoot = path.join(__dirname, '..');

  // Remove unecessary deps
  delete rekitPkgJson.dependencies.colors;
  delete rekitPkgJson.dependencies.argparse;
  delete rekitPkgJson.devDependencies.codecov;
  delete rekitPkgJson.devDependencies['gitbook-cli'];

  // The package.json for the new created project
  const pkgJson = {
    name: prjName,
    version: '0.0.1',
    private: true,
    description: 'A new project created by Rekit.',
    babel: rekitPkgJson.babel,
    nyc: rekitPkgJson.nyc,
  };

  // Remove unecessary scripts
  pkgJson.scripts = {
    start: 'node ./tools/server.js',
    build: 'node ./tools/build.js',
    test: 'node ./tools/run_test.js',
    'build:test': 'node ./tools/server.js -m build',
  };

  // Copy all necessary files
  console.log('Copying files...');
  shell.cp('-R', path.join(rekitRoot, './src'), prjPath);
  shell.cp('-R', path.join(rekitRoot, './tools'), prjPath);
  shell.cp('-R', path.join(rekitRoot, './test'), prjPath);

  shell.rm(path.join(prjPath, 'test/cli/rekit.js'));
  shell.rm(path.join(prjPath, 'test/cli/npm.js'));
  shell.rm('-rf', path.join(prjPath, 'src/.tmp')); // in case _tmp folder is copied.

  [
    '.eslintrc',
    'gitignore.tpl',
    'favicon.png',
    'webpack.dev.config.js',
    'webpack.dist.config.js',
    'webpack.dll.config.js',
    'webpack.test.config.js',
  ].forEach((file) => {
    shell.cp(path.join(rekitRoot, file), prjPath);
  });

  // Create gitignore
  shell.mv(path.join(prjPath, 'gitignore.tpl'), path.join(prjPath, '.gitignore'));

  const prjConfig = {
    dependencies: _.keys(rekitPkgJson.dependencies),
    devDependencies: _.keys(rekitPkgJson.devDependencies),
  };

  // Remove unecessary deps
  delete prjConfig.dependencies['request']; // eslint-disable-line

  console.log('Getting dependencies versions...');

  function done(pkgVersions) {
    pkgJson.dependencies = _.pick(pkgVersions, prjConfig.dependencies);
    pkgJson.devDependencies = _.pick(pkgVersions, prjConfig.devDependencies);
    shell.ShellString(JSON.stringify(pkgJson, null, '  ')).to(path.join(prjPath, 'package.json'));
    console.log('Project creation success!');
    console.log(`To run the project, please go to the project folder "${prjName}" and:`);
    console.log('  1. run "npm install" to install dependencies.');
    console.log('  2. run "npm start" to start the dev server.');
    console.log('Enjoy!');
  }

  request('http://raw.githubusercontent.com/supnate/rekit-deps/master/deps.2.x.json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      done(JSON.parse(body));
    } else {
      console.log('Network failure. Please check and retry.');
      console.log(error || body);
      shell.rm('-rf', prjPath);
      process.exit(1);
    }
  });
}

module.exports = create;
