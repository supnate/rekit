/*
  Summary:
    Run specific tests
  Usage examples:
   - node run_test.js // run all tests
   - node run_test.js features/home // run tests for home feature
   - node run_test.js features/home/redux/reducer.test.js // run reducer test
*/

'use strict';
const path = require('path');
// const shell = require('shelljs');
const npmRun = require('npm-run');

const prjRoot = path.join(__dirname, '../');

let testFile = process.argv[2];
let needReport = false;
if (!testFile) {
  needReport = true;
  testFile = path.join(prjRoot, 'tests/**/*.test.js');
} else {
  testFile = path.join(prjRoot, 'tests', testFile);
}
console.log('Running tests: ', testFile.replace(prjRoot, ''), '...');

const env = Object.create(process.env);
env.NODE_ENV = 'test';
const opts = {
  cwd: prjRoot,
  stdio: 'inherit',
  env,
};

const params = [
  'mocha-webpack',
  '--colors',
  '--include',
  'tests/before-all.js',
  '--webpack-config',
  'webpack.test.config.js',
  `"${testFile || path.join(prjRoot, 'tests/**/*.test.js')}"`,
];

if (needReport) {
  params.splice(0, 0,
    'nyc',
    '--report-dir=coverage'
  );
}
npmRun.execSync(params.join(' '), opts);
