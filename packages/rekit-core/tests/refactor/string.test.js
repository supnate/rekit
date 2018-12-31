'use strict';

const traverse = require('babel-traverse').default;
const vio = require('../../core/vio');
const ast = require('../../core/ast');
const refactor = require('../../core/refactor');
const helpers = require('../helpers');

const V_FILE = '/vio-temp-file';

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('refactor array tests', function() {
  // eslint-disable-line
  before(() => {
    vio.reset();
  });

  const CODE = `\
import A from './src/A';
const s1 = 'abcde';
const s2 = 'ghijk';
    `;

  it('renameStringLiteral', () => {
    vio.put(V_FILE, CODE);
    refactor.renameStringLiteral(V_FILE, './src/A', './src/B')
    refactor.renameStringLiteral(V_FILE, 'abcde', '12345');
    expectLines(V_FILE, ['const s1 = \'12345\';', 'import A from \'./src/B\';']);
  });
  it('replaceStringLiteral', () => {
    vio.put(V_FILE, CODE);
    refactor.replaceStringLiteral(V_FILE, 'hij', '234', false);
    expectLines(V_FILE, ['const s2 = \'g234k\';']);
  });
});
