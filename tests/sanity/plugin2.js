'use strict';

// Sanity test for redux-saga and selector plugin
// It's temparially wrote here for convenience, will move to plugin project in future.
// It runs tests under the auto generated app 'a-rekit-npm-test-app'

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;
const _ = require('lodash');

function exec(cmd, opts) {
  expect(shell.exec(cmd, opts || {}).code).to.equal(0, 'Command failed, exit code should be 0');
}

const appName = 'a-rekit-npm-test-app';
const prjRoot = path.join(__dirname, '../../');
const appRoot = path.join(prjRoot, '../', appName);
const appPkgJsonPath = path.join(appRoot, 'package.json');
const pkg = require(appPkgJsonPath); // eslint-disable-line


function reset() {
  console.log('Reset environment...');
  _.pull(pkg.rekit.plugins, 'redux-saga');
  _.pull(pkg.rekit.plugins, 'selector');
  shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
  shell.rm('-rf', path.join(appRoot, 'node_modules/rekit-plugin-redux-saga'));
  shell.rm('-rf', path.join(appRoot, 'node_modules/rekit-plugin-selector'));
}

reset();

let pluginRoot;

// rekit-plugin-redux-saga
pluginRoot = path.join(appRoot, '../rekit-plugin-redux-saga');
exec(`npm install ${pluginRoot}`, { cwd: appRoot });
pkg.rekit.plugins.push('redux-saga');
shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
exec('rekit add action home/a1 -a', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a1.js'))).to.be.true;
exec('npm test features/home/redux/a1.test.js', { cwd: appRoot });

exec('rekit mv action home/a1 home/a2', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a1.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a2.js'))).to.be.true;
exec('npm test features/home/redux/a2.test.js', { cwd: appRoot });

exec('rekit mv action home/a2 common/a1', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a2.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/common/redux/a1.js'))).to.be.true;
exec('npm test features/common/redux/a1.test.js', { cwd: appRoot });

exec('rekit rm action common/a1', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/common/redux/a1.js'))).to.be.false;

// rekit-plugin-selector
pluginRoot = path.join(appRoot, '../rekit-plugin-redux-saga');
exec(`npm install ${pluginRoot}`, { cwd: appRoot });
pkg.rekit.plugins.push('redux-saga');
exec('rekit add action home/a1 -a', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a1.js'))).to.be.true;
exec('npm test features/home/redux/a1.test.js');

exec('rekit mv action home/a1 home/a2', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a1.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a2.js'))).to.be.true;
exec('npm test features/home/redux/a2.test.js');

exec('rekit mv public-test home/a1 common/a1', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/redux/a1.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/common/redux/a2.js'))).to.be.true;
exec('npm test features/common/redux/a1.test.js');

exec('rekit rm public-test common/a1', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/common/redux/a1.js'))).to.be.false;

