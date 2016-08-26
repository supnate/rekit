// This script tests the global rekit command creates project with all correct configs.

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;

const prjPath = path.join(__dirname, '../../');
const TEMP_APP_NAME = '.rekit_temp_app';
const tempAppFolder = path.join(prjPath, TEMP_APP_NAME);

function exec(cmd, options) {
  expect(shell.exec(cmd, options || {}).code).to.equal(0);
}

describe('rekit command tests', function() { // eslint-disable-line
  this.timeout(120000);

  it('creates new project successfully', () => {
    shell.rm('-rf', tempAppFolder);
    exec(`rekit ${TEMP_APP_NAME}`, { cwd: prjPath });   // create rekit project
    console.log('installing dependecies...');
    exec('npm install', { cwd: tempAppFolder });  // install dependecies
    console.log('run testing...');
    exec('npm test', { cwd: tempAppFolder }); // ensure test passes for the new project
    // shell.rm('-rf', tempAppFolder);
  });
});
