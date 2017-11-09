'use strict';

const expect = require('chai').expect;
const _ = require('lodash');
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;

const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;
const TEST_FEATURE_NAME_2 = helpers.TEST_FEATURE_NAME_2;
const CAMEL_TEST_FEATURE_NAME = _.camelCase(TEST_FEATURE_NAME);
const CAMEL_TEST_FEATURE_NAME_2 = _.camelCase(TEST_FEATURE_NAME_2);

const mapFeatureFile = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME);
const mapFeatureFile2 = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME_2);
const mapTestFile = _.partial(utils.mapTestFile, TEST_FEATURE_NAME);
const mapTestFile2 = _.partial(utils.mapTestFile, TEST_FEATURE_NAME_2);
const mapSrcFile = utils.mapSrcFile;

describe('feature', function() { // eslint-disable-line

  before(() => {
    // To reset test env
    vio.reset();
  });

  it('throw error when no args to add feature', () => {
    expect(core.addFeature).to.throw(Error);
  });

  it('add feature', () => {
    core.addFeature(TEST_FEATURE_NAME);
    expectFiles([
      'redux/actions.js',
      'redux/constants.js',
      'redux/reducer.js',
      'redux/initialState.js',
      'index.js',
      'route.js',
      'DefaultPage.js',
      'DefaultPage.less',
      'style.less',
    ].map(mapFeatureFile));

    expectLines(mapSrcFile('common/rootReducer.js'), [
      `import ${CAMEL_TEST_FEATURE_NAME}Reducer from '../features/${TEST_FEATURE_NAME}/redux/reducer';`,
      `  ${CAMEL_TEST_FEATURE_NAME}: ${CAMEL_TEST_FEATURE_NAME}Reducer,`,
    ]);
    expectLines(mapSrcFile('common/routeConfig.js'), [
      `import ${CAMEL_TEST_FEATURE_NAME}Route from '../features/${TEST_FEATURE_NAME}/route';`,
      `  ${CAMEL_TEST_FEATURE_NAME}Route,`,
    ]);
    expectLines(mapSrcFile('styles/index.less'), [
      `@import '../features/${TEST_FEATURE_NAME}/style.less';`,
    ]);
    expectFiles([
      'redux/reducer.test.js',
    ].map(mapTestFile));
  });

  it('rename feature', () => {
    core.moveFeature(TEST_FEATURE_NAME, TEST_FEATURE_NAME_2);
    expectNoLines(mapSrcFile('common/rootReducer.js'), [
      CAMEL_TEST_FEATURE_NAME,
    ]);
    expectNoLines(mapSrcFile('common/routeConfig.js'), [
      TEST_FEATURE_NAME,
    ]);
    expectNoLines(mapSrcFile('styles/index.less'), [
      TEST_FEATURE_NAME,
    ]);

    expectLines(mapSrcFile('common/rootReducer.js'), [
      `import ${CAMEL_TEST_FEATURE_NAME_2}Reducer from '../features/${TEST_FEATURE_NAME_2}/redux/reducer';`,
      `  ${CAMEL_TEST_FEATURE_NAME_2}: ${CAMEL_TEST_FEATURE_NAME_2}Reducer,`,
    ]);
    expectLines(mapSrcFile('common/routeConfig.js'), [
      `import ${CAMEL_TEST_FEATURE_NAME_2}Route from '../features/${TEST_FEATURE_NAME_2}/route';`,
      `  ${CAMEL_TEST_FEATURE_NAME_2}Route,`,
    ]);
    expectLines(mapSrcFile('styles/index.less'), [
      `@import '../features/${TEST_FEATURE_NAME_2}/style.less';`,
    ]);

    expectLines(mapFeatureFile2('DefaultPage.js'), [
      `      <div className="${TEST_FEATURE_NAME_2}-default-page">`,
    ]);
    expectLines(mapFeatureFile2('DefaultPage.less'), [
      `.${TEST_FEATURE_NAME_2}-default-page {`,
    ]);

    // verify test files
    expectLines(mapTestFile2('DefaultPage.test.js'), [
      `import { DefaultPage } from 'src/features/${TEST_FEATURE_NAME_2}/DefaultPage';`,
      `describe('${TEST_FEATURE_NAME_2}/DefaultPage', () => {`,
      `      renderedComponent.find('.${TEST_FEATURE_NAME_2}-default-page').getElement()`,
    ]);

    expectLines(mapTestFile2('redux/reducer.test.js'), [
      `import reducer from 'src/features/${TEST_FEATURE_NAME_2}/redux/reducer';`,
    ]);
  });

  it('remove feature', () => {
    core.removeFeature(TEST_FEATURE_NAME_2);
    expectNoFile(mapFeatureFile(''));
    expectNoFile(mapTestFile(''));
    expectNoLines(mapSrcFile('common/rootReducer.js'), [
      CAMEL_TEST_FEATURE_NAME_2,
    ]);
    expectNoLines(mapSrcFile('common/routeConfig.js'), [
      `${TEST_FEATURE_NAME_2}Route`,
    ]);
    expectNoLines(mapSrcFile('styles/index.less'), [
      `@import '../features/${TEST_FEATURE_NAME_2}/style.less';`,
    ]);
  });
});
