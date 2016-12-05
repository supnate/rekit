'use strict';

const expect = require('chai').expect;
const vio = require('../../../tools/lib/vio');
const refactor = require('../../../tools/lib/refactor');
const utils = require('../utils');

const V_FILE = '/vio-temp-file';

const CODE_1 = `\
export { a } from './a';
export b from './b';
export c, { d } from './d';

const v = 1;
`;

const CODE_2 = `\
const v = 1;
`;

describe('reafctor tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  describe('addExportFromLine', () => {
    it('should be added as the last line when there\'re other exports', () => {
      vio.put(V_FILE, CODE_1);
      const line = "export { e } from './e';";
      refactor.addExportFromLine(V_FILE, line);
      const lines = vio.getLines(V_FILE);
      expect(lines[3]).to.equal(line);
    });

    it('should be added as the first line when no other export', () => {
      vio.put(V_FILE, CODE_2);
      const line = "export { e } from './e';";
      refactor.addExportFromLine(V_FILE, line);
      const lines = vio.getLines(V_FILE);
      expect(lines[0]).to.equal(line);
    });
  });

  describe('removeExportFromLine', () => {
    it('should remove the target line', () => {
      vio.put(V_FILE, CODE_1);
      const line = "export { a } from './a';";
      refactor.removeExportFromLine(V_FILE, './a');
      const lines = vio.getLines(V_FILE);
      expect(refactor.lineIndex(lines, line)).to.equal(-1);
    });

    it('should do nothing if no export is found', () => {
      vio.put(V_FILE, CODE_2);
      const line = "export { e } from './e';";
      refactor.addExportFrom(V_FILE, line);
      const lines = vio.getLines(V_FILE);
      expect(lines[3]).to.equal(line);
    });
  });
});

