'use strict';

/**
 * Test the basic work flow of a Rekit project. Also test Rekit plugins 'redux-saga' and 'selector'.
 * There should be 'rekit-core', 'rekit-portal' as sibling folders of 'rekit' to run the test script:
 * - workspace
 * |-- rekit
 * |-- rekit-core
 * |-- rekit-portal
 * |-- rekit-plugin-redux-saga
 * |-- rekit-plugin-selector
 *
 * It does below things:
 * 1. Install Rekit globally (first uninstall and unlink Rekit).
 * 2. Create an app using less
 * 3. Install dependencies of the app using yarn
 * 4. Runt 'npm test' and check success.
 * 5. Create a public plugin named 'rekit-plugin-public-test', generate a dummy js module
 * 6. Config the plugin in the app
 * 7. Run 'rekit add sanity-test home/pt1', check result.
 * 8. Run 'rekit mv public-test home/pt1 home/pt2', then check result.
 * 9. Run 'rekit rm public-test home/pt1 home/pt2', then check result.
 * 10. Create a local plugin named 'rekit-plugin-local-test', generate a dummy js module
 * 11. Run 'rekit add local-test home/lt1', check result.
 * 12. Run 'rekit mv local-test home/lt1 home/lt2', then check result.
 * 13. Run 'rekit rm local-test home/lt1 home/lt2', then check result.
 * 14. npm start
 * 15. Open browser for app and portal, manually test it.
**/

// Run this test before published to npm, it simulates a clean env for ensure rekit command could
// be installed globally and rekit-core, rekit-portal works as expected.


// 1. Uninstall rekit -g, npm unlink rekit from rekit folder.
// 2. Install rekit to global from local folder
// 3. run rekit create to create an app
// 4. install app (optional use local rekit-core and rekit-portal)
// 5. app test should pass
// 6. npm start for manually test

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Integration test.',
});

parser.addArgument(['--local-rekit'], {
  help: 'Whether to use local Rekit. Otherwise install from npm repository.',
  action: 'storeTrue',
});

parser.addArgument(['--local-core'], {
  help: 'Whether to use local rekit-core. Otherwise install from npm repository.',
  action: 'storeTrue',
});

parser.addArgument(['--local-portal'], {
  help: 'Whether to use local rekit-portal. Otherwise install from npm repository.',
  action: 'storeTrue',
});

parser.addArgument(['--sass'], {
  help: 'Use sass instead of less.',
  action: 'storeTrue',
});

parser.addArgument(['--start'], {
  help: 'Whether to start the server',
  action: 'storeTrue',
});

const args = parser.parseArgs();

function exec(cmd, opts) {
  expect(shell.exec(cmd, opts || {}).code).to.equal(0, 'Command failed, exit code should be 0');
}

const appName = 'a-rekit-npm-test-app';
const prjRoot = path.join(__dirname, '../../');
const appRoot = path.join(prjRoot, '../', appName);
const appPkgJsonPath = path.join(appRoot, 'package.json');

// Remove app folder
shell.rm('-rf', appRoot);

// Uninstall Rekit globally and unlink it.
console.log('Uninstalling Rekit globally......');
shell.exec('yarn global remove rekit');

console.log('Unlinking Rekit......');
shell.exec('yarn unlink', { cwd: prjRoot });

// Install Rekit globally from local folder
if (args.local_rekit) {
  console.log('Install Rekit globally from local folder...');
  exec(`yarn global add file:${prjRoot}`);
} else {
  console.log('Install Rekit globally');
  exec('yarn global add rekit');
}

// Create a Rekit app
console.log('Create a new Rekit app...');
exec(`rekit create ${appName}${args.sass ? ' --sass' : ''}`, { cwd: path.join(prjRoot, '..') });

const pkg = require(appPkgJsonPath); // eslint-disable-line
if (args.local_core) {
  // Use local rekit-core
  console.log('Use local rekit core.');
  pkg.devDependencies['rekit-core'] = path.join(prjRoot, '../rekit-core');
  shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
}

if (args.local_portal) {
  // Use local rekit-portal
  console.log('Use local rekit portal.');
  pkg.devDependencies['rekit-portal'] = path.join(prjRoot, '../rekit-portal');
  shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
}

// Install deps
console.log('Install deps for the app...');
exec('yarn', { cwd: appRoot });

// Run tests
console.log('Run test for the app...');
exec('yarn test', { cwd: appRoot });

// Start the server
if (args.start) {
  console.log('Start the app...');
  exec('yarn start', { cwd: appRoot });
}

