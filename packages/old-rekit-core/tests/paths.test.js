'use strict';

const expect = require('chai').expect;
const paths = require('../core/paths');

describe('paths tests', function() {
  before(() => {});

  describe('relativeModuleSource', () => {
    it('it works', () => {
      const p1 = paths.relativeModuleSource('/a/b.js', '/a/c.js');
      expect(p1).to.equal('./c');
      const p2 = paths.relativeModuleSource('a/b.js', 'a/c.js');
      expect(p2).to.equal('./c');
      const p3 = paths.relativeModuleSource('./a/b.js', './a/c.js');
      expect(p3).to.equal('./c');
      const p4 = paths.relativeModuleSource('a/b/c.js', 'a/c/d.js');
      expect(p4).to.equal('../c/d');
      const p5 = paths.relativeModuleSource('a/b.js', 'c.js');
      expect(p5).to.equal('../c');
    });
  });
});
