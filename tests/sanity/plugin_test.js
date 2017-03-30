'use strict';

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;
// Create a public plugin: rekit-plugin-public-test
console.log('Create a public plugin');
const publicPluginRoot = path.join(appRoot, '../rekit-plugin-public-test');
shell.rm('-rf', publicPluginRoot);
exec('rekit create-plugin public-test', { cwd: path.join(appRoot, '../') });
exec('npm link', { cwd: publicPluginRoot });
exec('npm link rekit-plugin-public-test', { cwd: appRoot });
pkg.rekit.plugins.push('public-test');
shell.ShellString(JSON.stringify(pkg)).to(appPkgJsonPath);
shell.cat(path.join(__dirname, 'sanity/pluginSample.js')).to(path.join(publicPluginRoot, 'publicTest.js'));
exec('rekit add public-test home/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.true;
exec('rekit mv public-test home/my-cls home/my-cls-2', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.false;
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.true;
exec('rekit mv public-test home/my-cls-2 common/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.false;
expect(shell.exists(path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.true;
exec('rekit rm public-test common/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.false;

// Create a local plugin: rekit-plugin-local-test
console.log('Create a local plugin');
const localPluginRoot = path.join(appRoot, './tools/plugins/rekit-plugin-local-test');
exec('rekit create-plugin local-test', { cwd: appRoot });
shell.cat(path.join(__dirname, 'sanity/pluginSample.js')).to(path.join(localPluginRoot, 'localTest.js'));
exec('rekit add local-test home/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.true;
exec('rekit mv local-test home/my-cls home/my-cls-2', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls.js'))).to.be.false;
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.true;
exec('rekit mv local-test home/my-cls-2 common/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/home/MyCls2.js'))).to.be.false;
expect(shell.exists(path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.true;
exec('rekit rm local-test common/my-cls', { cwd: appRoot });
expect(shell.exists(path.join(appRoot, 'src/features/common/MyCls.js'))).to.be.false;
