'use strict';

const _ = require('lodash');
const expect = require('chai').expect;

const deps = require('../core/deps');
const vio = require('../core/vio');

const moduleA = 'src/moduleA.js';
const moduleB = 'src/moduleB.js';
const moduleC = 'src/moduleC.js';
const moduleD = 'src/moduleD.js';
const moduleIndex = 'src/index.js';

describe('deps', function() {
  beforeEach(() => {
    vio.reset();
  });

  it('handle normal import', () => {
    vio.put(
      moduleA,
      `
      import B from './moduleB';
      import { C } from './moduleC';
      import D, { D1 } from './moduleD';
    `
    );
    const resDeps = deps.getDeps(moduleA);
    expect(resDeps).to.deep.equal([
      { id: moduleB, defaultImport: true, type: 'file' },
      { id: moduleC, defaultImport: false, type: 'file', imported: ['C'] },
      { id: moduleD, defaultImport: true, type: 'file', imported: ['D1'] },
    ]);
  });
  it('get npm deps', () => {});
  it('computes export from', () => {});
  it('calculate imported', () => {});
  it('handle require', () => {});
  it('handle import', () => {});
  it('handle module alias', () => {});

  it(`computes deps via index entry`, () => {
    vio.put(moduleA, `import { B, C } from './index';`);
    // vio.put(moduleB, codeB);
    // vio.put(moduleC, codeC);
    vio.put(
      moduleIndex,
      `
      export { default as B } from './moduleB';
      export { default as C } from './moduleC';
    `
    );
    const resDeps = deps.getDeps(moduleA);
    expect(resDeps).to.deep.equal([
      { id: moduleB, imported: ['B'], type: 'file' },
      { id: moduleC, imported: ['C'], type: 'file' },
    ]);
  });
});
