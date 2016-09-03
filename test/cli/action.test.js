'use strict';
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const exec = helpers.exec;
const expectError = helpers.expectError;
const expectFile = helpers.expectFile;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: action tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    exec('npm run rm:feature test');
    exec('npm run add:feature test');
  });

  after(() => {
    exec('npm run rm:feature test');
  });

  [
    'npm run add:action',
    'npm run rm:action',
  ].forEach(cmd => {
    it(`throws exception when no args for "${cmd}"`, () => {
      expectError(cmd);
    });
  });


  it('add normal action', () => {
    exec('npm run add:action test/test-action');
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
    exec('npm run add:action test/test-action-2 my-action-type');
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
    exec('npm run rm:action test/test-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'TEST_ACTION',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
  });

  it('remove normal action with custom action type', () => {
    exec('npm run rm:action test/test-action-2 my-action-type');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'MY_ACTION_TYPE',
    ]);
    expectNoLines(mapFeatureFile('redux/actions.js'), [
      'testAction2',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction2.js'));
  });
});
