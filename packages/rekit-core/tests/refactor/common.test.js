'use strict';

const expect = require('chai').expect;
// const utils = require('../../core/utils');
const paths = require('../../core/paths');
const vio = require('../../core/vio');
const refactorCommon = require('../../core/refactor/common');

describe('refactor common tests', function() {
  // eslint-disable-line
  before(() => {
    vio.reset();
  });

  it('isLocalModule', () => {
    utils.setPkgJson({
      babel: {
        plugins: [
          [
            'module-resolver',
            {
              alias: {
                src: './src',
              },
            },
          ],
        ],
      },
    });

    expect(refactorCommon.isLocalModule('../f-2/redux/actions')).to.be.true;
    expect(refactorCommon.isLocalModule('src/common/routeConfig')).to.be.true;
    expect(refactorCommon.isLocalModule('react')).to.be.false;
  });

  it('resolveModulePath', () => {
    utils.setPkgJson({
      babel: {
        plugins: [
          [
            'module-resolver',
            {
              alias: {
                src: './src',
              },
            },
          ],
        ],
      },
    });

    const file = paths.map('src/features/f-1/Test.js');
    const p1 = refactorCommon.resolveModulePath(file, '../f-2/redux/actions');
    const p2 = refactorCommon.resolveModulePath(file, 'src/common/routeConfig');
    const p3 = refactorCommon.resolveModulePath(file, './M1');
    const p4 = refactorCommon.resolveModulePath(file, 'react');
    const p5 = refactorCommon.resolveModulePath(file, '../f-3');
    expect(p1).to.equal(paths.map('src/features/f-2/redux/actions'));
    expect(p2).to.equal(paths.map('src/common/routeConfig'));
    expect(p3).to.equal(paths.map('src/features/f-1/M1'));
    expect(p4).to.equal('react');
    expect(p5).to.equal(paths.map('src/features/f-3/index'));
  });
});
