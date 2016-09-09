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
const spawn = require('child_process').spawn;

const prjRoot = path.join(__dirname, '../');
const mocha = path.join(prjRoot, 'node_modules/.bin/mocha');
const nyc = path.join(prjRoot, 'node_modules/.bin/nyc');
const mochaWebpack = path.join(prjRoot, 'node_modules/.bin/mocha-webpack');

const args = process.argv[2];
let testFile = null;
if (args) {
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

const needReport = !args || args === 'app' || args === 'cli';

function runAppTest() {
  const params = [
    mochaWebpack,
    '--include',
    'test/app/before-all.js',
    '--webpack-config',
    'webpack.test.config.js',
    testFile || path.join(prjRoot, 'test/app/**/*.test.js'),
  ];

  if (needReport) {
    params.splice(0, 0,
      nyc,
      '--report-dir=coverage/app'
    );
  }

  const cmd = spawn(process.execPath, params, opts);
  return new Promise(resolve => {
    cmd.on('exit', () => {
      if (needReport) {
        console.log('App coverage report: ', path.join(prjRoot, 'coverage/app/lcov-report/index.html'));
      }
      resolve();
    });
  });
}

function runCliTest() {
  const params = [
    mocha,
    testFile || path.join(prjRoot, 'test/cli/**/*.test.js'),
  ];

  if (needReport) {
    params.splice(0, 0,
      nyc,
      '--report-dir=coverage/cli'
    );
  }

  const cmd = spawn(process.execPath, params, opts);
  return new Promise(resolve => {
    cmd.on('exit', () => {
      if (needReport) {
        console.log('Cli coverage report: ', path.join(prjRoot, 'coverage/cli/lcov-report/index.html'));
      }
      resolve();
    });
  });
}

function runAllTest() {
  const cacheFolder = path.join(prjRoot, 'coverage/.nyc_output');
  if (shell.test('-e', cacheFolder)) {
    shell.rm('-rf', cacheFolder);
  }
  shell.mkdir(cacheFolder);
  runAppTest().then(() => {
    shell.cp('-R', path.join(prjRoot, '.nyc_output/*'), cacheFolder);
    runCliTest().then(() => {
      shell.cp('-R', `${cacheFolder}/*`, path.join(prjRoot, '.nyc_output'));
      const cmd = spawn(process.execPath, [nyc, 'report'], opts);
      cmd.on('exit', () => {
        console.log('Overall coverage report: ', path.join(prjRoot, 'coverage/lcov-report/index.html'));
      });
      shell.rm('-rf', cacheFolder);
    });
  });
}

if (/^app/.test(args)) {
  runAppTest();
} else if (/^cli/.test(args)) {
  runCliTest();
} else if (!args) {
  runAllTest();
} else {
  throw new Error(`Can not find tests for ${args}`);
}
