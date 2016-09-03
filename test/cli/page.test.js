'use strict';
const helpers = require('./helpers');

const mapFeatureFile = helpers.mapFeatureFile;
const exec = helpers.exec;
const expectError = helpers.expectError;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;


describe('cli: page tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    exec('npm run rm:feature test');
    exec('npm run add:feature test');
  });

  after(() => {
    exec('npm run rm:feature test');
  });

  [
    'npm run add:page',
    'npm run rm:page',
  ].forEach(cmd => {
    it(`throws exception when no args for "${cmd}"`, () => {
      expectError(cmd);
    });
  });

  it('add page', () => {
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

  it('remove page', () => {
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
});
