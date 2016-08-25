const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;

const prjPath = path.join(__dirname, '../../');
const indexJs = path.join(prjPath, 'index.js');
const TEMP_APP_NAME = '.rekit_temp_app';
const tempAppFolder = path.join(prjPath, TEMP_APP_NAME);

describe('rekit command tests', function() { // eslint-disable-line
  this.timeout(50000);

  it('creates new project successfully', () => {
    shell.rm('-rf', tempAppFolder);

    expect(shell.exec(`node ${indexJs} ${TEMP_APP_NAME}`, { silent: true }).code).to.equal(0);
    shell.rm('-rf', tempAppFolder);
  });

  it('throws exception when no project name provided', () => {
    expect(shell.exec(`node ${indexJs}`, { silent: true }).code).to.equal(1);
  });

  it('throws exception if target folder exists', () => {
    shell.mkdir(tempAppFolder);
    expect(shell.exec(`node ${indexJs} ${TEMP_APP_NAME}`, { silent: true }).code).to.equal(1);
    shell.rm('-rf', tempAppFolder);
  });
});
