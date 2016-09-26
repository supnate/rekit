/*
  Summary:
    Run specific tests
  Usage examples:
   - node run_test.js // run all tests
   - node run_test.js app // run app tests
   - node run_test.js app/features/home // run tests for home feature
   - node run_test.js app/features/home/redux/reducer.test.js // run reducer test
   - node run_test.js cli // run cli tests
   - node run_test.js cli/action.test.js // run action cli tests
*/

'use strict';
const path = require('path');
const shell = require('shelljs');
const npmRun = require('npm-run');

const prjRoot = path.join(__dirname, '../');

let args = process.argv[2];
let testFile = null;
if (!args) {
  args = 'app';
}

if (args !== 'all') {
  testFile = path.join(prjRoot, 'test', args);
  if (shell.test('-d', testFile)) {
    testFile = path.join(testFile, '**/*.test.js');
  }
}
console.log(`Running test${(!testFile || /\*/.test(testFile)) ? 's' : ''}: `, (testFile || 'all').replace(prjRoot, ''), '...');

const env = Object.create(process.env);
env.NODE_ENV = 'test';
const opts = {
  cwd: prjRoot,
  stdio: 'inherit',
  env,
};

const needReport = args === 'all' || args === 'app' || args === 'cli';

function runAppTest() {
  const params = [
    'mocha-webpack',
    '--include',
    'test/app/before-all.js',
    '--webpack-config',
    'webpack.test.config.js',
    `"${testFile || path.join(prjRoot, 'test/app/**/*.test.js')}"`,
  ];

  if (needReport) {
    params.splice(0, 0,
      'nyc',
      '--report-dir=coverage/app'
    );
  }
  npmRun.execSync(params.join(' '), opts);
}

function runCliTest() {
  const params = [
    'mocha',
    testFile || path.join(prjRoot, 'test/cli/**/*.test.js'),
  ];

  if (needReport) {
    params.splice(0, 0,
      'nyc',
      '--report-dir=coverage/cli'
    );
  }
  npmRun.execSync(params.join(' '), opts);
}

function runAllTest() {
  const coverageFolder = path.join(prjRoot, 'coverage');
  if (!shell.test('-e', coverageFolder)) {
    shell.mkdir(coverageFolder);
  }
  const cacheFolder = path.join(coverageFolder, '.nyc_output');
  if (shell.test('-e', cacheFolder)) {
    shell.rm('-rf', cacheFolder);
  }
  shell.mkdir(cacheFolder);
  runAppTest();
  shell.cp('-R', path.join(prjRoot, '.nyc_output/*'), cacheFolder);
  runCliTest();
  shell.cp('-R', `${cacheFolder}/*`, path.join(prjRoot, '.nyc_output'));
  npmRun.execSync('nyc report --reporter=text-summary --reporter=lcov', opts);
  console.log('Overall coverage report: ', path.join(prjRoot, 'coverage/lcov-report/index.html'));
  shell.rm('-rf', cacheFolder);
}

if (/^app/.test(args)) {
  runAppTest();
} else if (/^cli/.test(args)) {
  runCliTest();
} else if (/^all/.test(args)) {
  runAllTest();
} else {
  console.error('Test files should be under test/app or test/cli.');
  process.exit(1);
}
