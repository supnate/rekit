// This script is only used to test the global rekit command creates project with all correct configs.

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;

const prjPath = path.join(__dirname, '../../');
const TEMP_APP_NAME = 'rekit_temp_app';
const tempAppFolder = path.join(prjPath, TEMP_APP_NAME);

function exec(cmd, options) {
  expect(shell.exec(cmd, options || {}).code).to.equal(0);
}

shell.rm('-rf', tempAppFolder);
exec(`rekit ${TEMP_APP_NAME}`, { cwd: prjPath });   // create rekit project
console.log('Installing dependecies...');
exec('npm install --registry=https://registry.npm.taobao.org', { cwd: tempAppFolder });  // install dependecies
console.log('Running tests...');
exec('npm run test', { cwd: tempAppFolder }); // ensure test passes for the new project
