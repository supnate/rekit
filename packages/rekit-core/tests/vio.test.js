'use strict';

const path = require('path');
const expect = require('chai').expect;
const vio = require('../core/vio');
const utils = require('../core/utils');
const paths = require('../core/paths');
require('./helpers');

describe('vio', function() {
  beforeEach(() => {
    vio.reset();
  });

  //   describe('getAst', function () {
  //     beforeEach(() => {
  //       vio.reset();
  //     });
  //     it('should parse code correctly', () => {
  //       const code = `\
  // const initialState = {
  //   fetchApiSchemaPending: false,
  //   fetchApiSchemaError: null,
  //   apiSchema:[]
  // };

  // export default initialState;
  // `;
  //       vio.put('V_FILE', code);
  //       const ast = vio.getAst('V_FILE');
  //       expect(ast).to.exist;
  //     });
  //   });

  describe('move dir', function() {
    beforeEach(() => {
      vio.reset();
    });
    it('file content cache should be updated', () => {
      vio.put('d1/d2/f1', 'c1');
      vio.moveDir('d1', 'nd1');
      expect(vio.getContent('nd1/d2/f1')).to.equal('c1');
      expect('nd1/d2/f1').to.satisfy(vio.fileExists);
      expect('d1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('new files should be updated', () => {
      vio.save('d1/d2/f1', 'c1');
      vio.moveDir('d1', 'nd1');
      expect(vio.getContent('nd1/d2/f1')).to.equal('c1');
      expect('nd1/d2/f1').to.satisfy(vio.fileExists);
      expect('d1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('files to delete should be updated', () => {
      vio.save('d1/d2/f1', 'c1');
      vio.del('d1/d2/f1');
      vio.moveDir('d1', 'nd1');
      expect('nd1/d2/f1').to.satisfy(vio.fileNotExists);
    });

    it('files to move should be updated', () => {
      vio.save('d1/d2/f1', 'c1');
      vio.move('d1/d2/f1', 'd1/d2/nf1');
      vio.moveDir('d1', 'nd1');
      expect('d1/d2/nf1').to.satisfy(vio.fileNotExists);
      expect('nd1/d2/nf1').to.satisfy(vio.fileExists);
    });

    it('dirs to create should be updated', () => {
      vio.mkdir('d1/d2');
      expect('d1/d2').to.satisfy(vio.dirExists);
      vio.moveDir('d1/d2', 'nd1/d2');
      expect('d1/d2').to.not.satisfy(vio.dirExists);
      expect('nd1/d2').to.satisfy(vio.dirExists);
    });

    it('dirs to delete should be updated', () => {
      vio.mkdir('d1/d2');
      expect('d1/d2').to.satisfy(vio.dirExists);
      vio.del('d1/d2');
      vio.moveDir('d1/d2', 'nd1/d2');
      expect('d1/d2').to.not.satisfy(vio.dirExists);
      expect('nd1/d2').to.not.satisfy(vio.dirExists);
    });
  });

  describe('ls', () => {
    paths.setProjectRoot(path.join(__dirname, './test-prj'));
    it('list files under src/common', () => {
      vio.save('src/common/aaa.js', 'aaa.js');
      vio.del('src/common/routeConfig.js');
      vio.del('src/common/rootReducer.js');
      const res = vio.ls('src/common');
      expect(res.length).to.equal(2);
    });
  });

  describe('move file/dir in disk folder', () => {
    paths.setProjectRoot(path.join(__dirname, './test-prj'));
    it('file exists after move', () => {
      vio.move('src/common/rootReducer.js', 'src/common/rootReducer2.js');
      expect(vio.fileExists('src/common/rootReducer2.js')).to.equal(true);
    });

    it('file exists after move dir', () => {
      vio.moveDir('src/common', 'src/common2');
      expect(vio.fileExists('src/common2/rootReducer.js')).to.equal(true);
    });

    it('file content exists after move dir', () => {
      vio.moveDir('src/common', 'src/common2');
      expect(vio.getContent('src/common2/rootReducer.js')).to.exist;
    });
  });
});
