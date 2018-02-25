'use strict';

const vio = require('../../core/vio');
const refactor = require('../../core/refactor');
const helpers = require('../helpers');

const V_FILE = '/vio-temp-file';

const expectLines = helpers.expectLines;

describe('importExport', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  const CODE = `\
// Test
import { /*abc */DefaultPage } from './'; // abc
`;

  it(`add import from`, () => {
    vio.put(V_FILE, CODE);
    refactor.addImportFrom(V_FILE, './', '', 'ModuleName');

    expectLines(V_FILE, [
      `import { DefaultPage, ModuleName } from './'; // abc`
    ]);
  });
});
