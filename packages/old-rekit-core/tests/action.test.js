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

describe('action', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
  });

  it('throw error when no args to add action', () => {
    expect(core.addAction).to.throw(Error);
  });

  it('throw error when no args to remove action', () => {
    expect(core.removeAction).to.throw(Error);
  });

  it('add sync action', () => {
    core.addAction(TEST_FEATURE_NAME, 'test-action');

    const actionType = core.utils.getActionType(TEST_FEATURE_NAME, 'test-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      `export const ${actionType} = '${actionType}';`,
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { testAction } from \'./testAction\';',
    ]);
    expectLines(mapFeatureFile('redux/reducer.js'), [
      'import { reducer as testActionReducer } from \'./testAction\';',
      '  testActionReducer,',
    ]);
    expectFile(mapFeatureFile('redux/testAction.js'));
    expectFile(mapTestFile('redux/testAction.test.js'));
  });

  it('rename sync action', () => {
    const source = { feature: TEST_FEATURE_NAME, name: 'test-action' };
    const target = { feature: TEST_FEATURE_NAME, name: 'renamed-action' };

    core.moveAction(source, target);

    const oldActionType = core.utils.getActionType(TEST_FEATURE_NAME, 'test-action');
    const newActionType = core.utils.getActionType(TEST_FEATURE_NAME, 'renamed-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      oldActionType,
    ]);

    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'testActionReducer',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
    expectNoFiles([
      'redux/testAction.test.js',
    ].map(mapTestFile));

    expectLines(mapFeatureFile('redux/constants.js'), [
      `export const ${newActionType} = '${newActionType}';`,
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { renamedAction } from \'./renamedAction\';',
    ]);
    expectLines(mapFeatureFile('redux/reducer.js'), [
      'import { reducer as renamedActionReducer } from \'./renamedAction\';',
      '  renamedActionReducer,',
    ]);
    expectFile(mapFeatureFile('redux/renamedAction.js'));
    expectFile(mapTestFile('redux/renamedAction.test.js'));
  });

  it('move sync action to a different feature', () => {
    const TEST_FEATURE_NAME_2 = `${TEST_FEATURE_NAME}-2`;
    core.addFeature(TEST_FEATURE_NAME_2);
    core.addAction(TEST_FEATURE_NAME, 'test-action-2');
    const source = { feature: TEST_FEATURE_NAME, name: 'test-action-2' };
    const target = { feature: TEST_FEATURE_NAME_2, name: 'renamed-action-2' };

    core.moveAction(source, target);
    const oldActionType = core.utils.getActionType(TEST_FEATURE_NAME, 'test-action-2');
    const newActionType = core.utils.getActionType(TEST_FEATURE_NAME_2, 'renamed-action-2');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      oldActionType,
    ]);

    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction2',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'testAction2Reducer',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction2.js'));
    expectNoFiles([
      'redux/testAction2.test.js',
    ].map(mapTestFile));

    const mapFeatureFile2 = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME_2);
    const mapTestFile2 = _.partial(utils.mapTestFile, TEST_FEATURE_NAME_2);
    expectLines(mapFeatureFile2('redux/constants.js'), [
      `export const ${newActionType} = '${newActionType}';`,
    ]);
    expectLines(mapFeatureFile2('redux/actions.js'), [
      'export { renamedAction2 } from \'./renamedAction2\';',
    ]);
    expectLines(mapFeatureFile2('redux/reducer.js'), [
      'import { reducer as renamedAction2Reducer } from \'./renamedAction2\';',
      '  renamedAction2Reducer,',
    ]);
    expectFile(mapFeatureFile2('redux/renamedAction2.js'));
    expectFile(mapTestFile2('redux/renamedAction2.test.js'));
  });

  it('remove sync action', () => {
    core.addAction(TEST_FEATURE_NAME, 'test-action');
    core.removeAction(TEST_FEATURE_NAME, 'test-action');
    const actionType = core.utils.getActionType(TEST_FEATURE_NAME, 'test-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      actionType,
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'testActionReducer',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
    expectNoFile(mapTestFile('redux/testAction.test.js'));
  });

  it('add async action', () => {
    core.addAction(TEST_FEATURE_NAME, 'async-action', { async: true });
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
    expectLines(mapFeatureFile('redux/reducer.js'), [
      'import { reducer as asyncActionReducer } from \'./asyncAction\';',
      '  asyncActionReducer,',
    ]);
    expectLines(mapFeatureFile('redux/initialState.js'), [
      '  asyncActionPending: false,',
      '  asyncActionError: null,',
    ]);
    expectFile(mapFeatureFile('redux/asyncAction.js'));
    expectFile(mapTestFile('redux/asyncAction.test.js'));
  });

  it('rename async action', () => {
    const source = { feature: TEST_FEATURE_NAME, name: 'async-action' };
    const target = { feature: TEST_FEATURE_NAME, name: 'renamed-async-action' };
    core.moveAction(source, target);
    const oldActionTypes = core.utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'async-action');
    const newActionTypes = core.utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'renamed-async-action');

    expectNoLines(mapFeatureFile('redux/constants.js'), [
      oldActionTypes.begin,
      oldActionTypes.success,
      oldActionTypes.failure,
      oldActionTypes.dismissError,
    ]);

    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'asyncAction',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'asyncActionReducer',
    ]);
    expectNoLines(mapFeatureFile('redux/initialState.js'), [
      '  asyncActionPending: false,',
      '  asyncActionError: null,',
    ]);
    expectNoFile(mapFeatureFile('redux/asyncAction.js'));
    expectNoFile(mapTestFile('redux/asyncAction.test.js'));

    expectLines(mapFeatureFile('redux/constants.js'), [
      `export const ${newActionTypes.begin} = '${newActionTypes.begin}';`,
      `export const ${newActionTypes.success} = '${newActionTypes.success}';`,
      `export const ${newActionTypes.failure} = '${newActionTypes.failure}';`,
      `export const ${newActionTypes.dismissError} = '${newActionTypes.dismissError}';`,
    ]);
    expectLines(mapFeatureFile(`redux/renamedAsyncAction.js`), [
      `        renamedAsyncActionPending: true,`,
      `        renamedAsyncActionPending: false,`,
      `        renamedAsyncActionError: null,`,
    ]);
    expectNoLines(mapFeatureFile(`redux/renamedAsyncAction.js`), [
      `        asyncActionPending: true,`,
      `        asyncActionPending: false,`,
      `        asyncActionError: null,`,
    ]);

    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { renamedAsyncAction, dismissRenamedAsyncActionError } from \'./renamedAsyncAction\';',
    ]);
    expectLines(mapFeatureFile('redux/reducer.js'), [
      'import { reducer as renamedAsyncActionReducer } from \'./renamedAsyncAction\';',
      '  renamedAsyncActionReducer,',
    ]);
    expectLines(mapFeatureFile('redux/initialState.js'), [
      '  renamedAsyncActionPending: false,',
      '  renamedAsyncActionError: null,',
    ]);
    expectFile(mapFeatureFile('redux/renamedAsyncAction.js'));
    expectFiles([
      'redux/renamedAsyncAction.test.js',
    ].map(mapTestFile));
  });

  it('move async action to a different feature', () => {
    const TEST_FEATURE_NAME_3 = `${TEST_FEATURE_NAME}-3`;
    core.addFeature(TEST_FEATURE_NAME_3);
    core.addAction(TEST_FEATURE_NAME, 'async-action-3', { async: true });
    const source = { feature: TEST_FEATURE_NAME, name: 'async-action-3' };
    const target = { feature: TEST_FEATURE_NAME_3, name: 'renamed-async-action-3' };

    core.moveAction(source, target);
    const oldActionTypes = core.utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'async-action-3');
    const newActionTypes = core.utils.getAsyncActionTypes(TEST_FEATURE_NAME_3, 'renamed-async-action-3');

    expectNoLines(mapFeatureFile('redux/constants.js'), [
      oldActionTypes.begin,
      oldActionTypes.success,
      oldActionTypes.failure,
      oldActionTypes.dismissError,
    ]);

    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'asyncAction3',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'asyncAction3Reducer',
    ]);
    expectNoLines(mapFeatureFile('redux/initialState.js'), [
      '  asyncAction3Pending: false,',
      '  asyncAction3Error: null,',
    ]);
    expectNoFile(mapFeatureFile('redux/asyncAction3.js'));
    expectNoFile(mapTestFile('redux/asyncAction3.test.js'));

    const mapFeatureFile3 = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME_3);
    const mapTestFile3 = _.partial(utils.mapTestFile, TEST_FEATURE_NAME_3);
    expectLines(mapFeatureFile3('redux/constants.js'), [
      `export const ${newActionTypes.begin} = '${newActionTypes.begin}';`,
      `export const ${newActionTypes.success} = '${newActionTypes.success}';`,
      `export const ${newActionTypes.failure} = '${newActionTypes.failure}';`,
      `export const ${newActionTypes.dismissError} = '${newActionTypes.dismissError}';`,
    ]);
    expectLines(mapFeatureFile3('redux/actions.js'), [
      'export { renamedAsyncAction3, dismissRenamedAsyncAction3Error } from \'./renamedAsyncAction3\';',
    ]);
    expectLines(mapFeatureFile3('redux/reducer.js'), [
      'import { reducer as renamedAsyncAction3Reducer } from \'./renamedAsyncAction3\';',
      '  renamedAsyncAction3Reducer,',
    ]);
    expectLines(mapFeatureFile3('redux/initialState.js'), [
      '  renamedAsyncAction3Pending: false,',
      '  renamedAsyncAction3Error: null,',
    ]);
    expectFile(mapFeatureFile3('redux/renamedAsyncAction3.js'));
    expectFile(mapTestFile3('redux/renamedAsyncAction3.test.js'));
  });

  it('remove async action', () => {
    core.removeAction(TEST_FEATURE_NAME, 'renamed-async-action');
    const actionTypes = core.utils.getAsyncActionTypes(TEST_FEATURE_NAME, 'renamed-async-action');

    expectNoLines(mapFeatureFile('redux/constants.js'), [
      actionTypes.begin,
      actionTypes.success,
      actionTypes.failure,
      actionTypes.dismissError,
    ]);

    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'renamedAsyncAction',
    ]);
    expectNoLines(mapFeatureFile('redux/reducer.js'), [
      'renamedAsyncActionReducer',
    ]);
    expectNoLines(mapFeatureFile('redux/initialState.js'), [
      '  asyncActionPending: false,',
      '  asyncActionError: null,',
    ]);
    expectNoFile(mapFeatureFile('redux/renamedAsyncAction.js'));
    expectNoFile(mapTestFile('redux/renamedAsyncAction.test.js'));
  });
});
