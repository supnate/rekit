'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');
const rekit = require('../../tools/lib/rekit');
const vio = require('../../tools/lib/vio');

const mapFeatureFile = helpers.mapFeatureFile;
const mapFeatureTestFile = helpers.mapFeatureTestFile;
const expectFile = helpers.expectFile;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

describe('cli: async action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    vio.reset();
    rekit.addFeature(TEST_FEATURE_NAME);
  });

  after(() => {
    vio.reset();
  });

  it('throw error when no args to add async action', () => {
    expect(rekit.addAsyncAction).to.throw(Error);
  });

  it('throw error when no args to remove async action', () => {
    expect(rekit.removeAction).to.throw(Error);
  });

  it('add async action', () => {
    rekit.addAsyncAction(TEST_FEATURE_NAME, 'async-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
      'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
      'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
      'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { asyncAction, dismissAsyncActionError } from \'./asyncAction\';',
    ]);
    expectFile(mapFeatureFile('redux/asyncAction.js'));
    expectFiles([
      'redux/asyncAction.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove async action', () => {
    rekit.removeAsyncAction(TEST_FEATURE_NAME, 'async-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
      'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
      'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
      'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'asyncAction',
    ]);
    expectNoFile(mapFeatureFile('redux/asyncAction.js'));
    expectNoFiles([
      'redux/asyncAction.test.js',
    ].map(mapFeatureTestFile));
  });
});
