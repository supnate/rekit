'use strict';
const helpers = require('./helpers');

const mapFile = helpers.mapFile;
const mapFeatureFile = helpers.mapFeatureFile;
const exec = helpers.exec;
const expectError = helpers.expectError;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;


describe('cli: component tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    exec('npm run rm:feature test');
    exec('npm run add:feature test');
  });

  after(() => {
    exec('npm run rm:feature test');
  });

  [
    'npm run add:component',
    'npm run rm:component',
  ].forEach(cmd => {
    it(`throws exception when no args for "${cmd}"`, () => {
      expectError(cmd);
    });
  });

  it('add feature component', () => {
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

  it('remove feature component', () => {
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
});
