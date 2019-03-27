/*
  Summary:
    Run specific tests
  Usage examples:
   - node run_test.js // run all tests
   - node run_test.js refactor.test.js // run refactor tests
*/

'use strict';

const path = require('path');
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
console.log(prjRoot);
console.log('Running tests: ', testFile.replace(prjRoot, ''), '...');

const env = Object.create(process.env);
env.NODE_ENV = 'test';

const opts = {
  cwd: prjRoot,
  stdio: 'inherit',
  env,
};
console.log('test file: ', testFile);
const params = ['mocha', '--require', 'tests/before-all.js', `"${testFile}"`];

if (needReport) {
  params.splice(0, 0, 'nyc', '--report-dir=coverage');
}
npmRun.execSync(params.join(' '), opts);

if (needReport) {
  console.log('Report: ', path.join(prjRoot, 'coverage/lcov-report/index.html'));
}
