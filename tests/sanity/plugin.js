'use strict';

/**
 * Test create plugin. It add a public plugin and local plugin separately and test them in the Rekit project itself.
 * If test succeeds, the plugins will be removed.
**/

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;
const _ = require('lodash');

_.pascalCase = _.flow(_.camelCase, _.upperFirst);

function exec(cmd, opts) {
  if (shell.test('-e', opts.cwd)) {
    expect(shell.exec(cmd, opts || {}).code).to.equal(0, 'Command failed, exit code should be 0');
  }
}

const appRoot = path.join(__dirname, '../../');
const appPkgJsonPath = path.join(appRoot, './package.json');
const pkg = require(appPkgJsonPath); // eslint-disable-line

const publicPluginRoot = path.join(appRoot, '../rekit-plugin-public-test');
const localPluginRoot = path.join(appRoot, './tools/plugins/local-test');

function reset() {
  console.log('Reset environment...');
  // exec('npm unlink', { cwd: publicPluginRoot });
  // exec('npm unlink rekit-plugin-public-test', { cwd: appRoot });
  shell.rm('-rf', publicPluginRoot);
  shell.rm('-rf', localPluginRoot);
  _.pull(pkg.rekit.plugins, 'public-test');
  shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
}

reset();

// Create a local plugin: rekit-plugin-local-test
console.log('Create a local plugin');
exec('rekit create-plugin local-test', { cwd: appRoot });
shell.cat(path.join(__dirname, 'pluginSample.js')).to(path.join(localPluginRoot, 'localTest.js'));
exec('rekit add local-test home/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.true;
exec('rekit mv local-test home/my-cls home/my-cls-2', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.true;
exec('rekit mv local-test home/my-cls-2 common/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.true;
exec('rekit rm local-test common/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.false;

// Create a public plugin: rekit-plugin-public-test
console.log('Create a public plugin', appRoot);

exec('rekit create-plugin public-test', { cwd: path.join(appRoot, '../') });
exec('npm link', { cwd: publicPluginRoot });
exec('npm link rekit-plugin-public-test', { cwd: appRoot });
pkg.rekit.plugins.push('public-test');
shell.ShellString(JSON.stringify(pkg, null, '  ')).to(appPkgJsonPath);
shell.cat(path.join(__dirname, 'pluginSample.js')).to(path.join(publicPluginRoot, 'publicTest.js'));
exec('rekit add public-test home/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.true;
exec('rekit mv public-test home/my-cls home/my-cls-2', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.true;
exec('rekit mv public-test home/my-cls-2 common/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.false;
expect(shell.test('-e', path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.true;
exec('rekit rm public-test common/my-cls', { cwd: appRoot });
expect(shell.test('-e', path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.false;

reset();



