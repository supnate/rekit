'use strict';

const expect = require('chai').expect;
const helpers = require('./helpers');
const rekit = require('../../tools/lib/rekit');
const vio = require('../../tools/lib/vio');

const mapFeatureFile = helpers.mapFeatureFile;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const mapFeatureTestFile = helpers.mapFeatureTestFile;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

describe('cli: page tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    rekit.addFeature(TEST_FEATURE_NAME);
  });

  after(() => {
    vio.reset();
  });

  it('throw error when no args to add page', () => {
    expect(rekit.addPage).to.throw(Error);
  });

  it('throw error when no args to remove page', () => {
    expect(rekit.removePage).to.throw(Error);
  });

  it('add page', () => {
    rekit.addPage(TEST_FEATURE_NAME, 'test-page');
    expectFiles([
      'TestPage.js',
      'TestPage.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'export TestPage from \'./TestPage\';',
    ]);
    expectLines(mapFeatureFile('route.js'), [
      '    { path: \'test-page\', component: TestPage },',
      '  TestPage,',
    ]);
  });

  it('throw error when component already exists', () => {
    expect(rekit.addPage.bind(rekit, TEST_FEATURE_NAME, 'test-page')).to.throw();
  });

  it('add page with url path', () => {
    rekit.addPage(TEST_FEATURE_NAME, 'test-page-2', 'test-path');
    expectFiles([
      'TestPage2.js',
      'TestPage2.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage2.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'export TestPage2 from \'./TestPage2\';',
    ]);
    expectLines(mapFeatureFile('route.js'), [
      '    { path: \'test-path\', component: TestPage2 },',
      '  TestPage2,',
    ]);
  });

  it('remove page', () => {
    rekit.removePage(TEST_FEATURE_NAME, 'test-page');
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
    expectNoFiles([
      'TestPage.test.js',
    ].map(mapFeatureTestFile));
  });

  it('remove page with url path', () => {
    rekit.removePage(TEST_FEATURE_NAME, 'test-page-2');
    expectNoFiles([
      'TestPage2.js',
      'TestPage2.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      '@import \'./TestPage2.less\';'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'import TestPage2 from \'./TestPage2\';',
      '  TestPage2,',
    ]);
    expectNoLines(mapFeatureFile('route.js'), [
      '    { path: \'test-path\', component: TestPage2 },',
      '  TestPage2,',
    ]);
    expectNoFiles([
      'TestPage2.test.js',
    ].map(mapFeatureTestFile));
  });
});
