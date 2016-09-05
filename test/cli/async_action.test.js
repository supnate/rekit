'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
const expectError = helpers.expectError;
const expectFile = helpers.expectFile;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: async action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    execTool('rm_feature.js test');
    execTool('add_feature.js test');
  });

  after(() => {
    execTool('rm_feature.js test');
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
    execTool('add_async_action.js test/async-action');
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
  });

  it('remove async action', () => {
    execTool('rm_async_action.js test/async-action');
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
  });
});
