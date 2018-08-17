'use strict';

const _ = require('lodash');
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

  it('computes export from', () => {
    vio.put(moduleIndex, `export { default as A, A1, A2 as AA2 } from './moduleA'; `);
    expect(deps.getDeps(moduleIndex)).to.deep.equal([
      {
        id: moduleA,
        exported: ['A', 'A1', 'AA2'],
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
    vio.put(moduleA, `import { B, C } from './index';`);
    vio.put(
      moduleIndex,
      `
      export { default as A } from './moduleA';
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
