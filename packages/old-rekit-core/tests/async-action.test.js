'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;

const expectFile = helpers.expectFile;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

const mapFeatureFile = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME);
const mapTestFile = _.partial(utils.mapTestFile, TEST_FEATURE_NAME);

describe('cli: async action tests', function() { // eslint-disable-line
  this.timeout(10000);

  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
  });

  it('throw error when no args to add async action', () => {
    expect(core.addAsyncAction).to.throw(Error);
  });

  it('throw error when no args to remove async action', () => {
    expect(core.removeAction).to.throw(Error);
  });

  it('add async action', () => {
    core.addAsyncAction(TEST_FEATURE_NAME, 'async-action');
    const actionTypes = utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'async-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      `export const ${actionTypes.begin} = '${actionTypes.begin}';`,
      `export const ${actionTypes.success} = '${actionTypes.success}';`,
      `export const ${actionTypes.failure} = '${actionTypes.failure}';`,
      `export const ${actionTypes.dismissError} = '${actionTypes.dismissError}';`,
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { asyncAction, dismissAsyncActionError } from \'./asyncAction\';',
    ]);
    expectFile(mapFeatureFile('redux/asyncAction.js'));
    expectFiles([
      'redux/asyncAction.test.js',
    ].map(mapTestFile));
  });

  it('remove async action', () => {
    core.removeAsyncAction(TEST_FEATURE_NAME, 'async-action');
    const actionTypes = utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'async-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      `export const ${actionTypes.begin} = '${actionTypes.begin}';`,
      `export const ${actionTypes.success} = '${actionTypes.success}';`,
      `export const ${actionTypes.failure} = '${actionTypes.failure}';`,
      `export const ${actionTypes.dismissError} = '${actionTypes.dismissError}';`,
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'asyncAction',
    ]);
    expectNoFile(mapFeatureFile('redux/asyncAction.js'));
    expectNoFiles([
      'redux/asyncAction.test.js',
    ].map(mapTestFile));
  });
});
