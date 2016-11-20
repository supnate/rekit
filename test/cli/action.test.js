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

describe('cli: action tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    rekit.addFeature(TEST_FEATURE_NAME);
  });

  after(() => {
    vio.reset();
  });

  it('throw error when no args to add action', () => {
    expect(rekit.addAction).to.throw(Error);
  });

  it('throw error when no args to remove action', () => {
    expect(rekit.removeAction).to.throw(Error);
  });

  it('add sync action', () => {
    rekit.addAction(TEST_FEATURE_NAME, 'test-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const TEST_ACTION = \'TEST_ACTION\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { testAction } from \'./testAction\';',
    ]);
    expectFile(mapFeatureFile('redux/testAction.js'));
    expectFiles([
      'redux/testAction.test.js',
    ].map(mapFeatureTestFile));
  });

  it('add sync action with custom action type', () => {
    rekit.addAction(TEST_FEATURE_NAME, 'test-action-2', 'my-action-type');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const MY_ACTION_TYPE = \'MY_ACTION_TYPE\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'export { testAction2 } from \'./testAction2\';',
    ]);
    expectFile(mapFeatureFile('redux/testAction2.js'));
    expectFiles([
      'redux/testAction2.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove sync action', () => {
    rekit.removeAction(TEST_FEATURE_NAME, 'test-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'TEST_ACTION',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
    expectNoFiles([
      'redux/testAction.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove sync action with custom action type', () => {
    rekit.removeAction(TEST_FEATURE_NAME, 'test-action-2', 'my-action-type');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'MY_ACTION_TYPE',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction2',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction2.js'));
    expectNoFiles([
      'redux/testAction2.test.js',
    ].map(mapFeatureTestFile));
  });
});
