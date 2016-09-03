/* eslint strict: 0, no-unused-expressions: 0 */
'use strict';

const path = require('path');
const expect = require('chai').expect;
const shell = require('shelljs');
const _ = require('lodash');

function mapFile(file) {
  return path.join(__dirname, '../../src', file);
}

function mapFeatureFile(file) {
  return path.join(__dirname, '../../src/features/test', file);
}

function exec(cmd) {
  // console.log('Test: ', cmd);
  expect(shell.exec(cmd, { silent: true }).code).to.equal(0);
}

function pureExec(cmd) {
  return shell.exec(cmd, { silent: true });
}

function expectError(cmd) {
  expect(pureExec(cmd).code).to.equal(1);
}

function expectFile(file) {
  expect(shell.test('-e', file)).to.be.true;
}

function expectFiles(files) {
  files.forEach(expectFile);
}

function expectNoFile(file) {
  expect(shell.test('-e', file)).to.be.false;
}

function expectNoFiles(files) {
  files.forEach(expectNoFile);
}

function getLines(file) {
  if (_.isArray(file)) return file; // already lines
  return shell.cat(file).split('\n');
}

function expectLine(file, line) {
  const lines = getLines(file);
  expect(_.includes(lines, line)).to.be.true;
}

function expectLines(file, lines) {
  lines.forEach(line => expectLine(file, line));
}

function expectNoLine(file, line) {
  const lines = getLines(file);
  expect(_.includes(lines, line)).to.be.false;
}

function expectNoLines(file, lines) {
  lines.forEach(line => expectNoLine(file, line));
}

describe('command line tools tests', function() { // eslint-disable-line
  this.timeout(20000);
  before(() => {
    // To reset test env
    exec('npm run rm:feature test');
  });

  it('add test feature', () => {
    /* ===== Test Add Feature ===== */
    exec('npm run add:feature test');
    expectFiles([
      'redux/actions.js',
      'redux/constants.js',
      'redux/reducer.js',
      'redux/initialState.js',
      'index.js',
      'route.js',
      'DefaultPage.js',
      'DefaultPage.less',
      'selectors.js',
      'style.less',
    ].map(mapFeatureFile));
    expectLines(mapFile('common/rootReducer.js'), [
      'import testReducer from \'../features/test/redux/reducer\';',
      '  test: testReducer,',
    ]);
    expectLines(mapFile('common/routeConfig.js'), [
      'import testRoute from \'../features/test/route\';',
      '    testRoute,',
    ]);
    expectLines(mapFile('styles/index.less'), [
      '@import \'../features/test/style.less\';',
    ]);
  });

  it('throws exception when feature name exists', () => {
    expectError('npm run add:feature test');
  });

  /*
    exceptions are handled correctly
  */
  [
    'npm run add:feature',
    'npm run add:page',
    'npm run add:component',
    'npm run add:action',
    'npm run add:async-action',
    'npm run rm:feature',
    'npm run rm:page',
    'npm run rm:component',
    'npm run rm:action',
    'npm run rm:async-action',
  ].forEach(cmd => {
    it(`throws exception when no args for "${cmd}"`, () => {
      expectError(cmd);
    });
  });

  /*
    even works well constatns.js, actions.js or reducer.js don't exist
  */
  // it('adding action works if constatns.js, actions.js or reducer.js don\'t exist', () => {
  //   exec('npm run rm:page test/default-page');
  //   exec('npm run rm:action test/test-test-action');
  //   shell.rm(mapFeatureFile('constants.js'));
  //   shell.rm(mapFeatureFile('actions.js'));
  //   shell.rm(mapFeatureFile('reducer.js'));

  //   exec('npm run add:action test/my-action');
  //   expectLines(mapFeatureFile('constants.js'), [
  //     'export const MY_ACTION = \'MY_ACTION\';',
  //   ]);
  //   expectLines(mapFeatureFile('actions.js'), [
  //     '  MY_ACTION,',
  //     'export function myAction() {',
  //   ]);
  //   expectLines(mapFeatureFile('reducer.js'), [
  //     '  MY_ACTION,',
  //     '    case MY_ACTION:',
  //   ]);
  // });

  // it('adding async action works if constatns.js, actions.js or reducer.js don\'t exist', () => {
  //   exec('npm run rm:action test/my-action');
  //   shell.rm(mapFeatureFile('constants.js'));
  //   shell.rm(mapFeatureFile('actions.js'));
  //   shell.rm(mapFeatureFile('reducer.js'));

  //   exec('npm run add:async-action test/my-async-action');
  //   expectLines(mapFeatureFile('constants.js'), [
  //     'export const MY_ASYNC_ACTION_BEGIN = \'MY_ASYNC_ACTION_BEGIN\';',
  //     'export const MY_ASYNC_ACTION_SUCCESS = \'MY_ASYNC_ACTION_SUCCESS\';',
  //     'export const MY_ASYNC_ACTION_FAILURE = \'MY_ASYNC_ACTION_FAILURE\';',
  //     'export const MY_ASYNC_ACTION_DISMISS_ERROR = \'MY_ASYNC_ACTION_DISMISS_ERROR\';',
  //   ]);
  //   expectLines(mapFeatureFile('actions.js'), [
  //     '  MY_ASYNC_ACTION_BEGIN,',
  //     '  MY_ASYNC_ACTION_SUCCESS,',
  //     '  MY_ASYNC_ACTION_FAILURE,',
  //     '  MY_ASYNC_ACTION_DISMISS_ERROR,',
  //     'export function myAsyncAction(args) {',
  //     'export function dismissMyAsyncActionError() {',
  //   ]);
  //   expectLines(mapFeatureFile('reducer.js'), [
  //     '  MY_ASYNC_ACTION_BEGIN,',
  //     '  MY_ASYNC_ACTION_SUCCESS,',
  //     '  MY_ASYNC_ACTION_FAILURE,',
  //     '  MY_ASYNC_ACTION_DISMISS_ERROR,',
  //     '  myAsyncActionError: null,',
  //     '  myAsyncActionPending: false,',
  //     '    case MY_ASYNC_ACTION_BEGIN:',
  //     '    case MY_ASYNC_ACTION_SUCCESS:',
  //     '    case MY_ASYNC_ACTION_FAILURE:',
  //     '    case MY_ASYNC_ACTION_DISMISS_ERROR:',
  //   ]);
  // });

  it('add normal action', () => {
    /* ===== Test Add Normal Action ===== */
    exec('npm run add:action test/test-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const TEST_ACTION = \'TEST_ACTION\';',
    ]);
    expectFile(mapFeatureFile('redux/testAction.js'));
    // expectLines(mapFeatureFile('redux/actions.js'), [
    //   '  TEST_ACTION,',
    //   'export function testAction() {',
    // ]);
    // expectLines(mapFeatureFile('reducer.js'), [
    //   '  TEST_ACTION,',
    //   '    case TEST_ACTION:',
    // ]);
  });

  it('add normal action with custom action type', () => {
    /* ===== Test Add Normal Action With Custom Action Type ===== */
    exec('npm run add:action test/test-action-2 my-action-type');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const MY_ACTION_TYPE = \'MY_ACTION_TYPE\';',
    ]);
    expectFile(mapFeatureFile('redux/testAction2.js'));
    // expectLines(mapFeatureFile('actions.js'), [
    //   '  MY_ACTION_TYPE,',
    //   'export function testAction2() {',
    // ]);
    // expectLines(mapFeatureFile('reducer.js'), [
    //   '  MY_ACTION_TYPE,',
    //   '    case MY_ACTION_TYPE:',
    // ]);
  });

  it('add async action', () => {
    /* ===== Test Add Async Action =====*/
    exec('npm run add:async-action test/async-action');
    expectLines(mapFeatureFile('redux/constants.js'), [
      'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
      'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
      'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
      'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
    ]);
    expectFile(mapFeatureFile('redux/asyncAction.js'));
    // expectLines(mapFeatureFile('actions.js'), [
    //   '  ASYNC_ACTION_BEGIN,',
    //   '  ASYNC_ACTION_SUCCESS,',
    //   '  ASYNC_ACTION_FAILURE,',
    //   '  ASYNC_ACTION_DISMISS_ERROR,',
    //   'export function asyncAction(args) {',
    //   'export function dismissAsyncActionError() {',
    // ]);
    // expectLines(mapFeatureFile('reducer.js'), [
    //   '  ASYNC_ACTION_BEGIN,',
    //   '  ASYNC_ACTION_SUCCESS,',
    //   '  ASYNC_ACTION_FAILURE,',
    //   '  ASYNC_ACTION_DISMISS_ERROR,',
    //   '  asyncActionError: null,',
    //   '  asyncActionPending: false,',
    //   '    case ASYNC_ACTION_BEGIN:',
    //   '    case ASYNC_ACTION_SUCCESS:',
    //   '    case ASYNC_ACTION_FAILURE:',
    //   '    case ASYNC_ACTION_DISMISS_ERROR:',
    // ]);
  });

  it('add page', () => {
    /* ===== Test Add Page =====*/
    exec('npm run add:page test/test-page');
    expectFiles([
      'TestPage.js',
      'TestPage.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'import TestPage from \'./TestPage\';',
      '  TestPage,',
    ]);
    expectLines(mapFeatureFile('route.js'), [
      '    { path: \'test-page\', component: TestPage },',
      '  TestPage,',
    ]);
  });

  it('throws exception when page name exists', () => {
    expectError('npm run add:page test/test-page');
  });

  it('add page with url path', () => {
    /* ===== Test Add Page With Url Path =====*/
    exec('npm run add:page test/test-page-2 test-path');
    expectFiles([
      'TestPage2.js',
      'TestPage2.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage2.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'import TestPage2 from \'./TestPage2\';',
      '  TestPage2,',
    ]);
    expectLines(mapFeatureFile('route.js'), [
      '    { path: \'test-path\', component: TestPage2 },',
      '  TestPage2,',
    ]);
  });

  it('add feature component', () => {
    /* ===== Test Add Feature Component =====*/
    exec('npm run add:component test/test-component');
    expectFiles([
      'TestComponent.js',
      'TestComponent.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestComponent.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'import TestComponent from \'./TestComponent\';',
      '  TestComponent,',
    ]);
  });

  it('throws exception when component name exists', () => {
    expectError('npm run add:component test/test-component');
  });

  it('add common component', () => {
    /* ===== Test Add Common Component =====*/
    exec('npm run add:component common-component');
    expectFiles([
      'components/CommonComponent.js',
      'components/CommonComponent.less',
    ].map(mapFile));
    expectLines(mapFile('components/style.less'), [
      '@import \'./CommonComponent.less\';'
    ]);
    expectLines(mapFile('components/index.js'), [
      'import CommonComponent from \'./CommonComponent\';',
      '  CommonComponent,',
    ]);
  });

  it('remove normal action', () => {
    /* ===== Test Remove Normal Action =====*/
    exec('npm run rm:action test/test-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'export const TEST_ACTION = \'TEST_ACTION\';',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction.js'));
    // expectNoLines(mapFeatureFile('actions.js'), [
    //   '  TEST_ACTION,',
    //   'export function testAction() {',
    // ]);
    // expectNoLines(mapFeatureFile('reducer.js'), [
    //   '  TEST_ACTION,',
    //   '    case TEST_ACTION:',
    // ]);
  });

  it('remove normal action with custom action type', () => {
    /* ===== Test Remove Normal Action With Custom Action Type =====*/
    exec('npm run rm:action test/test-action-2 my-action-type');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'export const MY_ACTION_TYPE = \'MY_ACTION_TYPE\';',
    ]);
    expectNoFile(mapFeatureFile('redux/testAction2.js'));

    // expectNoLines(mapFeatureFile('actions.js'), [
    //   '  MY_ACTION_TYPE,',
    //   'export function testAction2() {',
    // ]);
    // expectNoLines(mapFeatureFile('reducer.js'), [
    //   '  MY_ACTION_TYPE,',
    //   '    case MY_ACTION_TYPE:',
    // ]);
  });

  it('remove async action', () => {
    /* ===== Test Remove Async Action =====*/
    exec('npm run rm:async-action test/async-action');
    expectNoLines(mapFeatureFile('redux/constants.js'), [
      'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
      'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
      'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
      'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
    ]);
    expectNoFile(mapFeatureFile('redux/asyncAction.js'));

    // expectNoLines(mapFeatureFile('actions.js'), [
    //   '  ASYNC_ACTION_BEGIN,',
    //   '  ASYNC_ACTION_SUCCESS,',
    //   '  ASYNC_ACTION_FAILURE,',
    //   '  ASYNC_ACTION_DISMISS_ERROR,',
    //   'export function asyncAction() {',
    //   'export function dismissAsyncActionError() {',
    // ]);
    // expectNoLines(mapFeatureFile('reducer.js'), [
    //   '  ASYNC_ACTION_BEGIN,',
    //   '  ASYNC_ACTION_SUCCESS,',
    //   '  ASYNC_ACTION_FAILURE,',
    //   '  ASYNC_ACTION_DISMISS_ERROR,',
    //   '  asyncActionError: null,',
    //   '  asyncActionPending: false,',
    //   '    case ASYNC_ACTION_BEGIN:',
    //   '    case ASYNC_ACTION_SUCCESS:',
    //   '    case ASYNC_ACTION_FAILURE:',
    //   '    case ASYNC_ACTION_DISMISS_ERROR:',
    // ]);
  });

  it('remove page', () => {
    /* ===== Test Remove Page =====*/
    exec('npm run rm:page test/test-page');
    expectNoFiles([
      'TestPage.js',
      'TestPage.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage.less\';'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'import TestPage from \'./TestPage\';',
      '  TestPage,',
    ]);
    expectNoLines(mapFeatureFile('route.js'), [
      '    { path: \'test-page\', component: TestPage },',
      '  TestPage,',
    ]);
  });

  it('remove page with url path', () => {
    /* ===== Test Remove Page With Url Path =====*/
    exec('npm run rm:page test/test-page');
    expectNoFiles([
      'TestPage.js',
      'TestPage.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage.less\';'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'import TestPage from \'./TestPage\';',
      '  TestPage,',
    ]);
    expectNoLines(mapFeatureFile('route.js'), [
      '    { path: \'test-path\', component: TestPage },',
      '  TestPage,',
    ]);
  });

  it('remove feature component', () => {
    /* ===== Test Remove Feature Component =====*/
    exec('npm run rm:component test/test-component');
    expectNoFiles([
      'TestComponent.js',
      'TestComponent.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      '@import \'./TestComponent.less\';'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'import TestComponent from \'./TestComponent\';',
      '  TestComponent,',
    ]);
  });

  it('remove common component', () => {
    /* ===== Test Remove Common Component =====*/
    exec('npm run rm:component common-component');
    expectNoFiles([
      'components/CommonComponent.js',
      'components/CommonComponent.less',
    ].map(mapFile));
    expectNoLines(mapFile('components/style.less'), [
      '@import \'./CommonComponent.less\';'
    ]);
    expectNoLines(mapFile('components/index.js'), [
      'import CommonComponent from \'./CommonComponent\';',
      '  CommonComponent,',
    ]);
  });

  it('remove feature', () => {
    /* ===== Test Remove Feature =====*/
    exec('npm run rm:feature test');
    expectNoFile(mapFile('test'));
    expectNoLines(mapFile('common/rootReducer.js'), [
      'import testReducer from \'../features/test/reducer\';',
      '  test: testReducer,',
    ]);
    expectNoLines(mapFile('common/routeConfig.js'), [
      'import testRoute from \'../features/test/route\';',
      '    testRoute,',
    ]);
    expectNoLines(mapFile('styles/index.less'), [
      '@import \'../features/test/style.less\';',
    ]);
  });

  it('no error when removing a feature does not exist.', () => {
    exec('npm run rm:feature feature-does-not-exist-test');
  });
});
