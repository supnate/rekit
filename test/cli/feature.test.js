'use strict';
const expect = require('chai').expect;
const _ = require('lodash');
const helpers = require('./helpers');
const rekit = require('../../tools/lib/rekit');
const vio = require('../../tools/lib/vio');

const mapFile = helpers.mapFile;
const mapFeatureFile = helpers.mapFeatureFile;
const mapFeatureTestFile = helpers.mapFeatureTestFile;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;
const CAMEL_TEST_FEATURE_NAME = _.camelCase(TEST_FEATURE_NAME);

describe('cli: feature test', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    // To reset test env
    vio.reset();
  });

  it('throw error when no args to add feature', () => {
    expect(rekit.addFeature).to.throw(Error);
  });

  it('add test feature', () => {
    rekit.addFeature(TEST_FEATURE_NAME);
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
      `import ${CAMEL_TEST_FEATURE_NAME}Reducer from '../features/${TEST_FEATURE_NAME}/redux/reducer';`,
      `  ${CAMEL_TEST_FEATURE_NAME}: ${CAMEL_TEST_FEATURE_NAME}Reducer,`,
    ]);
    expectLines(mapFile('common/routeConfig.js'), [
      `import ${CAMEL_TEST_FEATURE_NAME}Route from '../features/${TEST_FEATURE_NAME}/route';`,
      `    ${CAMEL_TEST_FEATURE_NAME}Route,`,
    ]);
    expectLines(mapFile('styles/index.less'), [
      `@import '../features/${TEST_FEATURE_NAME}/style.less';`,
    ]);
    expectFiles([
      'redux/reducer.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove feature', () => {
    rekit.removeFeature(TEST_FEATURE_NAME);
    expectNoFile(mapFile('test'));
    expectNoLines(mapFile('common/rootReducer.js'), [
      CAMEL_TEST_FEATURE_NAME,
    ]);
    expectNoLines(mapFile('common/routeConfig.js'), [
      `${CAMEL_TEST_FEATURE_NAME}Route`,
    ]);
    expectNoLines(mapFile('styles/index.less'), [
      `@import '../features/${TEST_FEATURE_NAME}/style.less';`,
    ]);
    expectNoFiles([
      'redux/reducer.test.js',
    ].map(mapFeatureTestFile));
  });
});
