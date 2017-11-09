/* eslint quotes: 0 */
'use strict';

const expect = require('chai').expect;
const traverse = require('babel-traverse').default;
const vio = require('../core/vio');
const refactor = require('../core/refactor');
const array = require('../core/refactor/array');
const helpers = require('./helpers');

const expectFile = helpers.expectFile;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

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

const CODE_3 = `\
import A from './A';
import { C, D, Z } from './D';
import { E } from './E';
import F from './F';
import {
  G1,
  G2,
} from './G';
`;

describe('reafctor', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  // describe('addExportFromLine', () => {
  //   it('should add export as the last one when there\'re other exports', () => {
  //     vio.put(V_FILE, CODE_1);
  //     const line = "export { e } from './e';";
  //     refactor.addExportFromLine(V_FILE, line);
  //     const lines = vio.getLines(V_FILE);
  //     expect(lines[3]).to.equal(line);
  //   });

  //   it('should add export as the first line when no other export', () => {
  //     vio.put(V_FILE, CODE_2);
  //     const line = "export { e } from './e';";
  //     refactor.addExportFromLine(V_FILE, line);
  //     const lines = vio.getLines(V_FILE);
  //     expect(lines[0]).to.equal(line);
  //   });
  // });

  // describe('removeExportFromLine', () => {
  //   it('should remove the target line', () => {
  //     vio.put(V_FILE, CODE_1);
  //     const line = "export { a } from './a';";
  //     refactor.removeExportFromLine(V_FILE, './a');
  //     const lines = vio.getLines(V_FILE);
  //     expect(refactor.lineIndex(lines, line)).to.equal(-1);
  //   });

  //   it('should do nothing if no export is found', () => {
  //     vio.put(V_FILE, CODE_1);
  //     refactor.removeExportFromLine(V_FILE, './e');
  //     expect(vio.getContent(V_FILE)).to.equal(CODE_1);
  //   });
  // });

  describe('addImportFrom', () => {
    const CODE = `\
import A from './A';
import { C, D, Z } from './D';
import { E } from './E';
import F from './F';
import {
  G1,
  G2,
  G3,
} from './G';
import {
} from './';

const otherCode = 1;
`;
    it('should add import line when no module source exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addImportFrom(V_FILE, './K', 'K');
      refactor.addImportFrom(V_FILE, './L', 'L', 'L1');
      refactor.addImportFrom(V_FILE, './M', '', 'M1');
      refactor.addImportFrom(V_FILE, './N', 'N', ['N1', 'N2']);
      refactor.addImportFrom(V_FILE, './G', '', ['G4', 'G5']);
      refactor.addImportFrom(V_FILE, './', '', ['H1']);
      refactor.addImportFrom(V_FILE, './A', null, null, 'all');
      refactor.addImportFrom(V_FILE, './X', null, null, 'AllX');
      refactor.addImportFrom(V_FILE, './Y', 'Y');
      refactor.addImportFrom(V_FILE, './Z', 'Z');
      expectLines(V_FILE, [
        "import K from './K';",
        "import Y from './Y';",
        "import Z from './Z';",
        "import L, { L1 } from './L';",
        "import { M1 } from './M';",
        "import N, { N1, N2 } from './N';",
        "  G4,",
        "  G5,",
        "  H1,",
        "import A, * as all from './A';",
        "import * as AllX from './X';",
      ]);
    });

    it('should add import when empty', () => {
      const code = `
import {
} from './';

export default {
  path: 'rekit-test-feature',
  name: 'Rekit test feature',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
      `;
      vio.put(V_FILE, code);
      refactor.addImportFrom(V_FILE, './', '', 'A');
      expectLines(V_FILE, [
        '  A,',
      ]);
    });

    it('should add import specifier(s) when module exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addImportFrom(V_FILE, './A', 'AA', 'A1');
      refactor.addImportFrom(V_FILE, './D', 'W', 'Y');
      refactor.addImportFrom(V_FILE, './E', '', ['E', 'E1']);
      refactor.addImportFrom(V_FILE, './F', 'F');
      expectLines(V_FILE, [
        "import A, { A1 } from './A';",
        "import W, { C, D, Z, Y } from './D';",
        "import { E, E1 } from './E';",
      ]);
    });
  });

  describe('addExportFrom', () => {
    const CODE = `\
export { default as A } from './A';
export { C, D, Z } from './D';
export { E } from './E';
export { default as F } from './F';

const otherCode = 1;
`;
    it('should add export line when no module source exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addExportFrom(V_FILE, './K', 'K');
      refactor.addExportFrom(V_FILE, './L', 'L', 'L1');
      refactor.addExportFrom(V_FILE, './M', '', 'M1');
      refactor.addExportFrom(V_FILE, './N', 'N', ['N1', 'N2']);
      expectLines(V_FILE, [
        "export { default as K } from './K';",
        "export { default as L, L1 } from './L';",
        "export { M1 } from './M';",
        "export { default as N, N1, N2 } from './N';",
      ]);
    });

    it('should add export specifier(s) when module exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addExportFrom(V_FILE, './A', 'AA', 'A1');
      refactor.addExportFrom(V_FILE, './D', 'W', 'Y');
      refactor.addExportFrom(V_FILE, './E', '', ['E', 'E1']);
      refactor.addExportFrom(V_FILE, './F', 'F');

      expectLines(V_FILE, [
        "export { default as A, A1 } from './A';",
        "export { default as W, C, D, Z, Y } from './D';",
        "export { E, E1 } from './E';",
      ]);
    });
  });

  describe('renameImportSpecifier', () => {
    const CODE = `\
import A from './A';
import { C, D, Z as ZZ } from './D';
import { E } from './E';
import { E as EE } from './EE';
import F from './F';
import * as AllX from './X';
import {
  G1,
  G2,
  G3,
} from './G';
const a = A;
const d = D;
const e = E;
`;
    it('should rename imported specifiers correctly', () => {
      vio.put(V_FILE, CODE);
      refactor.renameImportSpecifier(V_FILE, 'A', 'A1');
      refactor.renameImportSpecifier(V_FILE, 'D', 'D1');
      refactor.renameImportSpecifier(V_FILE, 'Z', 'Z1');
      refactor.renameImportSpecifier(V_FILE, 'E', 'E1');
      refactor.renameImportSpecifier(V_FILE, 'G1', 'GG1');
      refactor.renameImportSpecifier(V_FILE, 'AllX', 'X');

      expectLines(V_FILE, [
        "import A1 from './A';",
        "import { C, D1, Z1 as ZZ } from './D';",
        "import { E1 } from './E';",
        "import { E1 as EE } from './EE';",
        "import * as X from './X';",
        '  GG1,',
        'const a = A1;',
        'const d = D1;',
      ]);
    });

    it('should rename imported specifiers correctly with specified module source', () => {
      vio.put(V_FILE, CODE);
      refactor.renameImportSpecifier(V_FILE, 'E', 'E1', './E');
      refactor.renameImportSpecifier(V_FILE, 'E', 'E2', './EE');

      expectLines(V_FILE, [
        "import { E1 } from './E';",
        "import { E2 as EE } from './EE';",
        'const e = E1;',
      ]);
    });
  });

  describe('renameExportSpecifier', () => {
    const CODE = `\
export { default as A } from './A';
export { C, D, Z } from './D';
export { E } from './E';
export { default as F } from './F';
`;
    it('renames export specifier when module source not specified', () => {
      vio.put(V_FILE, CODE);
      refactor.renameExportSpecifier(V_FILE, 'A', 'A1');
      refactor.renameExportSpecifier(V_FILE, 'D', 'D1');
      expectLines(V_FILE, [
        "export { default as A1 } from './A';",
        "export { C, D1, Z } from './D';",
      ]);
    });

    it('renames export specifier when module source is specified', () => {
      vio.put(V_FILE, CODE);
      refactor.renameExportSpecifier(V_FILE, 'A', 'A1', './A');
      refactor.renameExportSpecifier(V_FILE, 'E', 'E1', './C');
      expectLines(V_FILE, [
        "export { default as A1 } from './A';",
        "export { E } from './E';",
      ]);
    });
  });

  describe('removeImportSpecifier', () => {
    const CODE = `\
import A from './A';
import { C, D, Z } from './D';
import { E } from './E';
import F from './F';
import * as AllX from './X';
import {
  G1,
  G2,
} from './G';
`;
    it('should remove give import specifier', () => {
      vio.put(V_FILE, CODE);
      refactor.removeImportSpecifier(V_FILE, ['E', 'D', 'G1', 'AllX']);
      expectLines(V_FILE, [
        "import { C, Z } from './D';",
        "import {",
        "  G2,",
        "} from './G';",
      ]);
      expectNoLines(V_FILE, [
        "import { E } from './E';",
        "AllX",
        "  G1,",
      ]);
    });
  });

  describe('removeNamedExport', () => {
    it('should remove give export specifier', () => {
      vio.put(V_FILE, CODE_3);
      refactor.removeImportSpecifier(V_FILE, ['E', 'D']);
      expectLines(V_FILE, [
        "import { C, Z } from './D';",
      ]);
      expectNoLines(V_FILE, [
        "import { E } from './E';",
      ]);
    });
  });

  describe('removeImportBySource', () => {
    it('should remove import statement by given source', () => {
      vio.put(V_FILE, CODE_3);
      refactor.removeImportBySource(V_FILE, './A');
      refactor.removeImportBySource(V_FILE, './D');
      expectNoLines(V_FILE, [
        "import A from './A';",
        "import { C, D, Z } from './D';",
      ]);
    });
  });

  describe('object property manipulation', () => {
    const CODE = `\
const obj = {
  p1: 1,
  p2: 2,
  p3: 'abc',
  p4: true,
};

const obj1 = {
};

const obj2 = { p: 1 };
const obj3 = {};
const obj4 = { p1: 1, p2: 2, p3: 3 };

const c = obj.p1;
`;
    it('addObjectProperty should add new property when not exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addObjectProperty(V_FILE, 'obj', 'p5', 'true');
      expectLines(V_FILE, [
        "  p5: true,",
      ]);
    });

    it('addObjectProperty should not add new property when already exist', () => {
      vio.put(V_FILE, CODE);
      refactor.addObjectProperty(V_FILE, 'obj', 'p4', 'false');
      expectLines(V_FILE, [
        "  p4: true,",
      ]);
    });

    it('addObjectProperty should handle one line object declaration', () => {
      vio.put(V_FILE, CODE);
      refactor.addObjectProperty(V_FILE, 'obj2', 'p2', 'true');
      refactor.addObjectProperty(V_FILE, 'obj3', 'p', "'abc'");
      expectLines(V_FILE, [
        "const obj2 = { p: 1 , p2: true };",
        "const obj3 = { p: 'abc' };",
      ]);
    });

    it('setObjectProperty should set the new value', () => {
      vio.put(V_FILE, CODE);
      refactor.setObjectProperty(V_FILE, 'obj', 'p2', '345');
      expectLines(V_FILE, [
        "  p2: 345,",
      ]);
    });

    it('renameObjectProperty should rename property correctly', () => {
      vio.put(V_FILE, CODE);
      refactor.renameObjectProperty(V_FILE, 'obj', 'p1', 'n1');
      refactor.renameObjectProperty(V_FILE, 'obj2', 'p', 'n');
      expectLines(V_FILE, [
        "  n1: 1,",
        "const obj2 = { n: 1 };",
      ]);
    });

    it('removeObjectProperty should rename property correctly', () => {
      vio.put(V_FILE, CODE);
      refactor.removeObjectProperty(V_FILE, 'obj', 'p1');
      refactor.removeObjectProperty(V_FILE, 'obj', 'p3');
      refactor.removeObjectProperty(V_FILE, 'obj4', 'p2');
      expectNoLines(V_FILE, [
        "  p1: 1,",
        "  p3: 'abc',",
      ]);

      expectLines(V_FILE, [
        "const obj4 = { p1: 1, p3: 3 };",
      ]);

      refactor.removeObjectProperty(V_FILE, 'obj4', 'p1');

      expectLines(V_FILE, [
        "const obj4 = { p3: 3 };",
      ]);

      refactor.removeObjectProperty(V_FILE, 'obj4', 'p3');
      expectLines(V_FILE, [
        "const obj4 = { };",
      ]);
    });
  });

  describe('renameClassName', () => {
    const CODE = `\
import React, { PureComponent } from 'react';

export class Hello extends PureComponent {
  render() {
    return (
      <h1 className="home-hello">
       Welcome to your Rekit project!
      </h1>
    );
  }
}

export default Hello;
`;
    it('rename es6 class name', () => {
      vio.put(V_FILE, CODE);
      refactor.renameClassName(V_FILE, 'Hello', 'NewHello');
      expectLines(V_FILE, [
        "export class NewHello extends PureComponent {",
        "export default NewHello;",
      ]);
    });
  });

  describe('renameCssClassName', () => {
    const CODE = `\
import React, { PureComponent } from 'react';

export class Hello extends PureComponent {
  render() {
    return (
      <h1 className="home-hello">
        <label className="home-hello-label">Label</label>
        Welcome to your Rekit project!
      </h1>
    );
  }
}

export default Hello;
`;
    it('rename className property', () => {
      vio.put(V_FILE, CODE);
      refactor.renameCssClassName(V_FILE, 'home-hello', 'home-new-hello');
      expectLines(V_FILE, [
        '      <h1 className="home-new-hello">',
        '        <label className="home-new-hello-label">Label</label>',
      ]);
    });
  });

  describe('array manipulation', () => {
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
      expectLines(V_FILE, [
        'const arr1 = [];',
        'const arr2 = [a, b, 1];',
        '  5',
      ]);
    });
  });

  describe('find near char', () => {
    const s = '01, \n5 \n, ab]';
    it('nearestCharBefore', () => {
      let i = array.nearestCharBefore(',', s, 5);
      expect(i).to.equal(2);

      i = array.nearestCharBefore(',', s, 11);
      expect(i).to.equal(-1);
    });

    it('nearestCharAfter', () => {
      let i = array.nearestCharAfter(',', s, 5);
      expect(i).to.equal(8);

      i = array.nearestCharAfter(',', s, 0);
      expect(i).to.equal(-1);
    });
  });

  describe('replaceStringLiteral', () => {
    const code = `
const str1 = 'abcdefg';
const jsx = (
  <div className="div1">
    <h2 className="sub-title-2">sub-title</h2>
  </div>
);

`;
    it('should only replace full string when fullMatch === true', () => {
      vio.put(V_FILE, code);
      refactor.replaceStringLiteral(V_FILE, 'abcdefg', 'new-str');
      expectLines(V_FILE, [
        "const str1 = 'new-str';",
      ]);
      refactor.replaceStringLiteral(V_FILE, 'new', 'xxx');
      expectLines(V_FILE, [
        "const str1 = 'new-str';",
      ]);
    });

    it('should only replace full string when fullMatch === false', () => {
      vio.put(V_FILE, code);
      refactor.replaceStringLiteral(V_FILE, 'sub-title', 'second-title', false);
      expectLines(V_FILE, [
        '    <h2 className="second-title-2">sub-title</h2>',
      ]);
    });
  });
});
