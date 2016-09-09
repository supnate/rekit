'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const mapFeatureTestFile = helpers.mapFeatureTestFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
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
    execTool(`rm_feature.js ${TEST_FEATURE_NAME}`);
    execTool(`add_feature.js ${TEST_FEATURE_NAME}`);
  });

  after(() => {
    execTool(`rm_feature.js ${TEST_FEATURE_NAME}`);
  });

  [
    'add_async_action.js',
    'rm_async_action.js',
  ].forEach(script => {
    it(`throws exception when no args for "${script}"`, () => {
      expect(pureExecTool(script).code).to.equal(1);
    });
  });

  it('add async action', () => {
    execTool(`add_async_action.js ${TEST_FEATURE_NAME}/async-action`);
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
      'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
      'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
      'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'import { asyncAction, dismissAsyncActionError } from \'./asyncAction\';',
      '  asyncAction,',
      '  dismissAsyncActionError,',
    ]);
    expectFile(mapFeatureFile('redux/asyncAction.js'));
    expectFiles([
      'redux/asyncAction.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove async action', () => {
    execTool(`rm_async_action.js ${TEST_FEATURE_NAME}/async-action`);
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
