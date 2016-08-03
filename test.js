/* eslint strict: 0, no-unused-expressions: 0 */
'use strict';

const path = require('path');
const expect = require('chai').expect;
const shell = require('shelljs');
const _ = require('lodash');

function mapFile(file) {
  return path.join(__dirname, 'src', file);
}

function mapFeatureFile(file) {
  return path.join(__dirname, 'src/features/test', file);
}

function exec(cmd) {
  console.log('Test: ', cmd);
  expect(shell.exec(cmd, { silent: true }).code).to.equal(0);
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

const startTime = new Date().getTime();

// To reset test env
exec('npm run rm:feature test');

/* ===== Test Add Feature ===== */
exec('npm run add:feature test');
expectFiles([
  'actions.js',
  'constants.js',
  'index.js',
  'reducer.js',
  'route.js',
  'SamplePage.js',
  'SamplePage.less',
  'selectors.js',
  'style.less',
].map(mapFeatureFile));
expectLines(mapFile('common/rootReducer.js'), [
  'import testReducer from \'../features/test/reducer\';',
  '  testReducer,',
]);
expectLines(mapFile('common/routeConfig.js'), [
  'import testRoute from \'../features/test/route\';',
  '    testRoute,',
]);
expectLines(mapFile('styles/index.less'), [
  '@import \'../features/test/style.less\';',
]);

/* ===== Test Add Normal Action ===== */
exec('npm run add:action test/test-action');
expectLines(mapFeatureFile('constants.js'), [
  'export const TEST_ACTION = \'TEST_ACTION\';',
]);
expectLines(mapFeatureFile('actions.js'), [
  '  TEST_ACTION,',
  'export function testAction() {',
]);
expectLines(mapFeatureFile('reducer.js'), [
  '  TEST_ACTION,',
  '    case TEST_ACTION:',
]);

/* ===== Test Add Async Action =====*/
exec('npm run add:async-action test/async-action');
expectLines(mapFeatureFile('constants.js'), [
  'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
  'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
  'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
  'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
]);
expectLines(mapFeatureFile('actions.js'), [
  '  ASYNC_ACTION_BEGIN,',
  '  ASYNC_ACTION_SUCCESS,',
  '  ASYNC_ACTION_FAILURE,',
  '  ASYNC_ACTION_DISMISS_ERROR,',
  'export function asyncAction() {',
  'export function dismissAsyncActionError() {',
]);
expectLines(mapFeatureFile('reducer.js'), [
  '  ASYNC_ACTION_BEGIN,',
  '  ASYNC_ACTION_SUCCESS,',
  '  ASYNC_ACTION_FAILURE,',
  '  ASYNC_ACTION_DISMISS_ERROR,',
  '    case ASYNC_ACTION_BEGIN:',
  '    case ASYNC_ACTION_SUCCESS:',
  '    case ASYNC_ACTION_FAILURE:',
  '    case ASYNC_ACTION_DISMISS_ERROR:',
]);

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

/* ===== Test Remove Normal Action =====*/
exec('npm run rm:action test/test-action');
expectNoLines(mapFeatureFile('constants.js'), [
  'export const TEST_ACTION = \'TEST_ACTION\';',
]);
expectNoLines(mapFeatureFile('actions.js'), [
  '  TEST_ACTION,',
  'export function testAction() {',
]);
expectNoLines(mapFeatureFile('reducer.js'), [
  '  TEST_ACTION,',
  '    case TEST_ACTION:',
]);

/* ===== Test Remove Async Action =====*/
exec('npm run rm:async-action test/async-action');
expectNoLines(mapFeatureFile('constants.js'), [
  'export const ASYNC_ACTION_BEGIN = \'ASYNC_ACTION_BEGIN\';',
  'export const ASYNC_ACTION_SUCCESS = \'ASYNC_ACTION_SUCCESS\';',
  'export const ASYNC_ACTION_FAILURE = \'ASYNC_ACTION_FAILURE\';',
  'export const ASYNC_ACTION_DISMISS_ERROR = \'ASYNC_ACTION_DISMISS_ERROR\';',
]);
expectNoLines(mapFeatureFile('actions.js'), [
  '  ASYNC_ACTION_BEGIN,',
  '  ASYNC_ACTION_SUCCESS,',
  '  ASYNC_ACTION_FAILURE,',
  '  ASYNC_ACTION_DISMISS_ERROR,',
  'export function asyncAction() {',
  'export function dismissAsyncActionError() {',
]);
expectNoLines(mapFeatureFile('reducer.js'), [
  '  ASYNC_ACTION_BEGIN,',
  '  ASYNC_ACTION_SUCCESS,',
  '  ASYNC_ACTION_FAILURE,',
  '  ASYNC_ACTION_DISMISS_ERROR,',
  '    case ASYNC_ACTION_BEGIN:',
  '    case ASYNC_ACTION_SUCCESS:',
  '    case ASYNC_ACTION_FAILURE:',
  '    case ASYNC_ACTION_DISMISS_ERROR:',
]);

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

/* ===== Test Remove Feature =====*/
exec('npm run rm:feature test');
expectNoFile(mapFile('test'));
expectNoLines(mapFile('common/rootReducer.js'), [
  'import testReducer from \'../features/test/reducer\';',
  '  testReducer,',
]);
expectNoLines(mapFile('common/routeConfig.js'), [
  'import testRoute from \'../features/test/route\';',
  '    testRoute,',
]);
expectNoLines(mapFile('styles/index.less'), [
  '@import \'../features/test/style.less\';',
]);

const endTime = new Date().getTime();
console.log('Test success: ', endTime - startTime, 'ms.');
