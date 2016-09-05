'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
const expectFile = helpers.expectFile;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    execTool('rm_feature.js test');
    execTool('add_feature.js test');
  });

  after(() => {
    execTool('rm_feature.js test');
  });

  [
    'add_action.js',
    'rm_action.js',
  ].forEach(script => {
    it(`throws exception when no args for "${script}"`, () => {
      expect(pureExecTool(script).code).to.equal(1);
    });
  });

  it('add normal action', () => {
    execTool('add_action.js test/test-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const TEST_ACTION = \'TEST_ACTION\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'import { testAction } from \'./testAction\';',
      '  testAction,',
    ]);
    expectFile(mapFeatureFile('redux/testAction.js'));
  });

  it('add normal action with custom action type', () => {
    execTool('add_action.js test/test-action-2 my-action-type');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const MY_ACTION_TYPE = \'MY_ACTION_TYPE\';',
    ]);
    expectLines(mapFeatureFile('redux/actions.js'), [
      'import { testAction2 } from \'./testAction2\';',
      '  testAction2,',
    ]);
    expectFile(mapFeatureFile('redux/testAction2.js'));
  });

  it('remove normal action', () => {
    execTool('rm_action.js test/test-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'TEST_ACTION',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
  });

  it('remove normal action with custom action type', () => {
    execTool('rm_action.js test/test-action-2 my-action-type');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'MY_ACTION_TYPE',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction2',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction2.js'));
  });
});
