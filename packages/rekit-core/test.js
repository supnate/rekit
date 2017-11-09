'use strict';

const V_FILE = '/v_file';
// const CODE = `\
// import A from './A';
// import { C, D, Z as ZZ } from './D';
// import { E } from './E';
// import { E as EE } from './EE';
// import F from './F';
// const a = A;
// const d = D;
// `;

const CODE = `\
import { E } from './E';
import { E as EE } from './EE';

const a = E;
function abc() {
  const E = 2;
  const b = E;
}
`;

const vio = require('./core/vio');
const refactor = require('./core/refactor');

vio.put(V_FILE, CODE);
refactor.renameImportSpecifier(V_FILE, 'E', 'E1', './E');
console.log(vio.getContent(V_FILE));
