'use strict';

const expect = require('chai').expect;
const vio = require('../core/vio');
const utils = require('../core/utils');
const template = require('../core/template');

const V_FILE = '/vio-temp-file';
const TPL_1 = `\
const actionType = $\{actionType};
`;

const RES_1 = `\
const actionType = ACTION_TYPE;
`;

describe('template tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });

  describe('readTemplate', () => {
    it('should read template content with absolute path', () => {
      vio.put(V_FILE, TPL_1);
      expect(template.readTemplate(V_FILE)).to.equal(TPL_1);
    });
  });

  describe('generate template', () => {
    it('should generate result correctly', () => {
      vio.put(V_FILE, TPL_1);
      template.generate(V_FILE + '.res', {
        templateFile: V_FILE,
        context: { actionType: 'ACTION_TYPE' }
      });
      expect(vio.getContent(V_FILE + '.res')).to.equal(RES_1);
    });
  });
});
