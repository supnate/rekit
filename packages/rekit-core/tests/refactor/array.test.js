'use strict';

const traverse = require('babel-traverse').default;
const vio = require('../../core/vio');
const refactor = require('../../core/refactor');
const helpers = require('../helpers');

const V_FILE = '/vio-temp-file';

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('refactor array tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  const CODE = `\
const arr1 = [];
const arr2 = [a, b, c];
const arr3 = [
];
const arr4 = [
  { p1: 1, p2: 2 },
];
const arr5 = [
  5
];
const arr6 = [
  a,
  {
    abc: 1,
  },
  {
    def: 2,
  },
];
const arr7 = [
  abc,
  def,
  ghi,
];
    `;

  it(`addToArrayByNode`, () => {
    vio.put(V_FILE, CODE);
    const ast = vio.getAst(V_FILE);
    const arrs = {};
    traverse(ast, {
      VariableDeclarator(path) {
        const node = path.node;
        node.init._filePath = ast._filePath;
        arrs[node.id.name] = node.init;
      }
    });

    const changes = [].concat(
      refactor.addToArrayByNode(arrs.arr1, '1'),
      refactor.addToArrayByNode(arrs.arr2, '1'),
      refactor.addToArrayByNode(arrs.arr3, '1'),
      refactor.addToArrayByNode(arrs.arr4, '{ p: 1 }'),
      refactor.addToArrayByNode(arrs.arr5, '6')
    );

    const code = refactor.updateSourceCode(vio.getContent(V_FILE), changes);
    vio.put(V_FILE, code);

    expectLines(V_FILE, [
      'const arr1 = [1];',
      'const arr2 = [a, b, c, 1];',
      'const arr3 = [',
      '  1,',
      '];',
      'const arr4 = [',
      '  { p1: 1, p2: 2 },',
      '  { p: 1 },',
      '];',
      'const arr5 = [',
      '  5,',
      '  6',
      '];',
    ]);
  });

  it(`removeFromArrayByNode`, () => {
    const ast = vio.getAst(V_FILE);
    const arrs = {};
    traverse(ast, {
      VariableDeclarator(path) {
        const node = path.node;
        node.init._filePath = ast._filePath;
        arrs[node.id.name] = node.init;
      }
    });

    const changes = [].concat(
      refactor.removeFromArrayByNode(arrs.arr1, arrs.arr1.elements[0]),
      refactor.removeFromArrayByNode(arrs.arr2, arrs.arr2.elements[2]),
      refactor.removeFromArrayByNode(arrs.arr3, arrs.arr3.elements[0]),
      refactor.removeFromArrayByNode(arrs.arr4, arrs.arr4.elements[1]),
      refactor.removeFromArrayByNode(arrs.arr5, arrs.arr5.elements[1]),
      refactor.removeFromArrayByNode(arrs.arr6, arrs.arr6.elements[1])
    );

    const code = refactor.updateSourceCode(vio.getContent(V_FILE), changes);
    vio.put(V_FILE, code);

    expectLines(V_FILE, [
      'const arr1 = [];',
      'const arr2 = [a, b, 1];',
      'const arr3 = [',
      '];',
      'const arr4 = [',
      '  { p1: 1, p2: 2 },',
      '];',
      'const arr5 = [',
      '  5',
      '];',
    ]);

    expectNoLines(V_FILE, [
      '  1,',
      '  { p: 1 },',
      '  6',
      '    abc: 1',
    ]);
  });

  it('addToArray', () => {
    refactor.addToArray(V_FILE, 'arr1', 'x');
    refactor.addToArray(V_FILE, 'arr2', 'y');
    refactor.addToArray(V_FILE, 'arr5', 'z');
    expectLines(V_FILE, [
      'const arr1 = [x];',
      'const arr2 = [a, b, 1, y];',
      '  5,',
      '  z',
    ]);
  });
  it('removeFromArray', () => {
    refactor.removeFromArray(V_FILE, 'arr1', 'x');
    refactor.removeFromArray(V_FILE, 'arr2', 'y');
    refactor.removeFromArray(V_FILE, 'arr5', 'z');
    refactor.removeFromArray(V_FILE, 'arr7', 'abc');
    expectNoLines(V_FILE, [
      'const arr7 = [,',
    ]);
    expectLines(V_FILE, [
      'const arr1 = [];',
      'const arr2 = [a, b, 1];',
      '  5',
    ]);
  });
});

