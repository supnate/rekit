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

describe('cli: action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    execTool('rm_feature.js', TEST_FEATURE_NAME);
    execTool('add_feature.js', TEST_FEATURE_NAME);
  });

  after(() => {
    execTool('rm_feature.js', TEST_FEATURE_NAME);
  });

  [
    'add_action.js',
    'rm_action.js',
  ].forEach(script => {
    it(`exit 1 when no args for "${script}"`, () => {
      expect(pureExecTool(script).code).to.equal(1);
    });
  });

  it('add normal action', () => {
    execTool('add_action.js', `${TEST_FEATURE_NAME}/test-action`);
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const TEST_ACTION = \'TEST_ACTION\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'import { testAction } from \'./testAction\';',
      '  testAction,',
    ]);
    expectFile(mapFeatureFile('redux/testAction.js'));
    expectFiles([
      'redux/testAction.test.js',
    ].map(mapFeatureTestFile));
  });

  it('add normal action with custom action type', () => {
    execTool('add_action.js', `${TEST_FEATURE_NAME}/test-action-2 my-action-type`);
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const MY_ACTION_TYPE = \'MY_ACTION_TYPE\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'import { testAction2 } from \'./testAction2\';',
      '  testAction2,',
    ]);
    expectFile(mapFeatureFile('redux/testAction2.js'));
    expectFiles([
      'redux/testAction2.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove normal action', () => {
    execTool('rm_action.js', `${TEST_FEATURE_NAME}/test-action`);
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

  it('remove normal action with custom action type', () => {
    execTool('rm_action.js', `${TEST_FEATURE_NAME}/test-action-2 my-action-type`);
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
