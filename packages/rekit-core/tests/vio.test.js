'use strict';

const path = require('path');
const expect = require('chai').expect;
const vio = require('../core/vio');
const utils = require('../core/utils');
require('./helpers');

describe('vio', function () {
  beforeEach(() => {
    vio.reset();
  });

  describe('move dir', function () {
    beforeEach(() => {
      vio.reset();
    });
    it('file content cache should be updated', () => {
      vio.put('/d1/d2/f1', 'c1');
      vio.moveDir('/d1', '/nd1');
      expect(vio.getContent('/nd1/d2/f1')).to.equal('c1');
      expect('/nd1/d2/f1').to.satisfy(vio.fileExists);
      expect('/d1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('new files should be updated', () => {
      vio.save('/d1/d2/f1', 'c1');
      vio.moveDir('/d1', '/nd1');
      expect(vio.getContent('/nd1/d2/f1')).to.equal('c1');
      expect('/nd1/d2/f1').to.satisfy(vio.fileExists);
      expect('/d1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('files to delete should be updated', () => {
      vio.save('/d1/d2/f1', 'c1');
      vio.del('/d1/d2/f1');
      vio.moveDir('/d1', '/nd1');
      expect('/nd1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('files to move should be updated', () => {
      vio.save('/d1/d2/f1', 'c1');
      vio.move('/d1/d2/f1', '/d1/d2/nf1');
      vio.moveDir('/d1', '/nd1');
      expect('/d1/d2/nf1').to.satisfy(vio.fileNotExists);
      expect('/nd1/d2/nf1').to.satisfy(vio.fileExists);
    });

    it('dirs to create should be updated', () => {
      vio.mkdir('/d1/d2');
      expect('/d1/d2').to.satisfy(vio.dirExists);
      vio.moveDir('/d1/d2', '/nd1/d2');
      expect('/d1/d2').to.not.satisfy(vio.dirExists);
      expect('/nd1/d2').to.satisfy(vio.dirExists);
    });

    it('dirs to delete should be updated', () => {
      vio.mkdir('/d1/d2');
      expect('/d1/d2').to.satisfy(vio.dirExists);
      vio.del('/d1/d2');
      vio.moveDir('/d1/d2', '/nd1/d2');
      expect('/d1/d2').to.not.satisfy(vio.dirExists);
      expect('/nd1/d2').to.not.satisfy(vio.dirExists);
    });
  });

  describe('ls', () => {
    utils.setProjectRoot(path.join(__dirname, './test-prj'));
    it('list files under src/common', () => {
      const res = vio.ls(path.join(utils.getProjectRoot(), 'src/common'));
      expect(res.length).to.equal(3);
    });
  });
});

