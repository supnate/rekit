'use strict';

const traverse = require('babel-traverse').default;
const vio = require('../../core/vio');
const refactor = require('../../core/refactor');
const helpers = require('../helpers');

const V_FILE = '/vio-temp-file';

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('rename a variable', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  const CODE = `\
const arr1 = [];
function abc() {
  let v1 = 1;
}
    `;

  it(`rename the first matched variable`, () => {
    vio.put(V_FILE, CODE);
    const ast = vio.getAst(V_FILE);
    refactor.renameIdentifier(V_FILE, 'arr1', 'arr2');
    refactor.renameIdentifier(V_FILE, 'v1', 'v2');

    expectLines(V_FILE, [
      'const arr2 = [];',
      '  let v2 = 1;',
    ]);
  });

});

