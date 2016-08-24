const shell = require('shelljs');
const expect = require('chai').expect;

describe('rekit command tests', function() { // eslint-disable-line
  this.timeout(50000);

  it('creates new project successfully', () => {
    shell.rm('-rf', './_test_prj');
    expect(shell.exec('node ./index.js _test_prj', { silent: true }).code).to.equal(0);
    shell.rm('-rf', './_test_prj');
  });

  it('throws exception when no project name provided', () => {
    expect(shell.exec('node ./index.js', { silent: true }).code).to.equal(1);
  });

  it('throws exception if target folder exists', () => {
    shell.mkdir('_test_prj');
    expect(shell.exec('node ./index.js _test_prj', { silent: true }).code).to.equal(1);
    shell.rm('-rf', '_test_prj');
  });
});
