'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;
const constant = core.constant;

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

const mapReduxFile = _.partial(utils.mapReduxFile, TEST_FEATURE_NAME);

describe('constant', function() { // eslint-disable-line
  const targetPath = mapReduxFile('constants');
  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
  });

  it('add constant adds constant at end', () => {
    constant.add(TEST_FEATURE_NAME, 'CONST_1');
    expectLines(targetPath, [
      "export const CONST_1 = 'CONST_1';",
    ]);
  });

  it('rename constant rename constant name and value', () => {
    constant.rename(TEST_FEATURE_NAME, 'CONST_1', 'NEW_CONST_1');
    expectNoLines(targetPath, [
      "export const CONST_1 = 'CONST_1';",
    ]);
    expectLines(targetPath, [
      "export const NEW_CONST_1 = 'NEW_CONST_1';",
    ]);
  });

  it('remove constant removes constant line', () => {
    constant.remove(TEST_FEATURE_NAME, 'NEW_CONST_1');
    expectNoLines(targetPath, [
      "export const NEW_CONST_1 = 'NEW_CONST_1';",
    ]);
  });
});
