/* Run specific tests */
'use strict';
const path = require('path');
const shell = require('shelljs');
const child_process = require('child_process');

const prjRoot = path.join(__dirname, '../');
const mocha = path.join(prjRoot, 'node_modules/.bin/mocha');
const nyc = path.join(prjRoot, 'node_modules/.bin/nyc');
const crossEnv = path.join(prjRoot, 'node_modules/.bin/cross-env');
const mochaWebpack = path.join(prjRoot, 'node_modules/.bin/mocha-webpack');

const args = process.argv[2];
const testFolder = path.join(prjRoot, 'test');
const appTestFolder = path.join(testFolder, 'app');
const cliTestFolder = path.join(testFolder, 'cli');

let testFile = path.join(prjRoot, 'test', args);
if (shell.test('-d', testFile)) {
  testFile = path.join(testFile, '**/*.test.js');
  console.log(testFile);
}

function runAppTest(testFile) {
  const params = [
    mochaWebpack,
    '--include',
    'test/app/before-all.js',
    '--webpack-config',
    'webpack.test.config.js',
    testFile,
  ];

  if (testFile === path.join(appTestFolder, '**/*.test.js')) {
    params.splice(0, 0,
      nyc,
      '--report-dir=coverage/app'
    );
  }

  const env = Object.create(process.env);
  env.NODE_ENV = 'test';
  const opts = {
    cwd: prjRoot,
    stdio: 'inherit',
    env,
  };

  child_process.spawn(process.execPath, params, opts);
}

function runCliTest() {

}

runAppTest(testFile);
