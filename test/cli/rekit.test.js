const shell = require('shelljs');
const expect = require('chai').expect;

describe('rekit command tests', function() { // eslint-disable-line
  this.timeout(50000);
  before(() => {
    shell.rm('-rf', './_test_prj');
  });

  it('creates new project', () => {
    expect(shell.exec('node ./index.js _test_prj').code, { silent: true }).to.equal(0);
  });

  after(() => {
    shell.rm('-rf', './_test_prj');
  });
});
