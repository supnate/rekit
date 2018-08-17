'use strict';

const expect = require('chai').expect;

const paths = require('../core/paths');
const deps = require('../core/deps');
const vio = require('../core/vio');

const moduleA = 'src/moduleA.js';
const moduleB = 'src/moduleB.js';
const moduleC = 'src/moduleC.js';
const moduleD = 'src/moduleD.js';
const moduleIndex = 'src/index.js';

describe('deps', function() {
  const pkgJsonPath = paths.map('package.json');
  before(() => {
    vio.reset();
    require.cache[pkgJsonPath] = {
      id: pkgJsonPath,
      filename: pkgJsonPath,
      loaded: true,
      exports: {
        babel: {
          plugins: [
            [
              'module-resolver',
              {
                alias: {
                  app: './src',
                },
              },
            ],
          ],
        },
      },
    };
  });
  after(() => {
    delete require.cache[pkgJsonPath];
  });

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

  it('get npm deps', () => {
    vio.put(moduleA, `import React, { Component } from 'react';`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: 'react',
        type: 'npm',
        imported: ['Component'],
        defaultImport: true,
      },
    ]);
  });

  it('handle export from', () => {
    vio.put(moduleIndex, `export { default as A, A1, A2 as AA2 } from './moduleA'; `);
    expect(deps.getDeps(moduleIndex)).to.deep.equal([
      {
        id: moduleA,
        exported: { A: 'default', A1: 'A1', AA2: 'A2' },
        type: 'file',
      },
    ]);
  });

  it('handle require', () => {
    vio.put(moduleA, `require('./moduleB');`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: moduleB,
        type: 'file',
        isRequire: true,
      },
    ]);
  });

  it('handle import', () => {
    vio.put(moduleA, `import('./moduleB');`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: moduleB,
        type: 'file',
        isImport: true,
      },
    ]);
  });

  it('merges import from', () => {
    vio.put(
      moduleA,
      `
        import { B1 } from './moduleB';
        import { B2 } from './moduleB';`
    );
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: moduleB,
        type: 'file',
        imported: ['B1', 'B2'],
        defaultImport: false,
      },
    ]);
  });

  it('handle namespace import', () => {
    vio.put(moduleA, `import * as ns from './';`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: moduleIndex,
        type: 'file',
        defaultImport: false,
        nsImport: true,
      },
    ]);
  });

  it('handle module alias', () => {
    vio.put(moduleA, `import B from 'app/moduleB';`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: moduleB,
        type: 'file',
        defaultImport: true,
      },
    ]);
  });

  it(`computes deps via index entry`, () => {
    vio.put(moduleA, `import foo, { B1, BB2, C } from './index';`);
    vio.put(moduleB, `import { A, D } from './index';`);
    vio.put(
      moduleIndex,
      `
      export { default as A } from './moduleA';
      export { default as B, B1, B2 as BB2 } from './moduleB';
      export { default as C } from './moduleC';
    `
    );
    expect(deps.getDeps(moduleA)).to.deep.equal([
      { id: moduleB, defaultImport: false, imported: ['B1', 'B2'], type: 'file' },
      { id: moduleC, defaultImport: true, type: 'file' },
      { id: moduleIndex, defaultImport: true, type: 'file' },
    ]);

    expect(deps.getDeps(moduleB)).to.deep.equal([
      { id: moduleA, defaultImport: true, type: 'file' },
      { id: moduleIndex, defaultImport: false, imported: ['D'], type: 'file' },
    ]);
  });

  it(`import from a folder resolves to index.js`, () => {
    vio.mkdir('src/moduleFolder');
    vio.put(moduleA, `import F from './moduleFolder';`);
    expect(deps.getDeps(moduleA)).to.deep.equal([
      {
        id: 'src/moduleFolder/index.js',
        type: 'file',
        defaultImport: true,
      },
    ]);
  });
});
