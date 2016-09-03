'use strict';
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const exec = helpers.exec;
const expectError = helpers.expectError;
const expectFile = helpers.expectFile;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: async action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    exec('npm run rm:feature test');
    exec('npm run add:feature test');
  });

  after(() => {
    exec('npm run rm:feature test');
  });

  [
    'npm run add:async-action',
    'npm run rm:async-action',
  ].forEach(cmd => {
    it(`throws exception when no args for "${cmd}"`, () => {
      expectError(cmd);
    });
  });

  it('add async action', () => {
    exec('npm run add:async-action test/async-action');
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
    exec('npm run rm:async-action test/async-action');
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
