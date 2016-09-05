'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
const expectError = helpers.expectError;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;


describe('cli: page tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    execTool('rm_feature.js test');
    execTool('add_feature.js test');
  });

  after(() => {
    execTool('rm_feature.js test');
  });

  [
    'add_page.js',
    'rm_page.js',
  ].forEach(script => {
    it(`throws exception when no args for "${script}"`, () => {
      expect(pureExecTool(script).code).to.equal(1);
    });
  });

  it('add page', () => {
    execTool('add_page.js test/test-page');
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
    expect(pureExecTool('add_page.js test/test-page').code).to.equal(1);
  });

  it('add page with url path', () => {
    execTool('add_page.js test/test-page-2 test-path');
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

  it('remove page', () => {
    execTool('rm_page.js test/test-page');
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
    execTool('rm_page.js test/test-page');
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
});
