'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFile = helpers.mapFile;
const mapFeatureFile = helpers.mapFeatureFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
const expectError = helpers.expectError;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: component tests', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    execTool('rm_feature.js test');
    execTool('add_feature.js test');
  });

  after(() => {
    execTool('rm_feature.js test');
  });

  [
    'add_component.js',
    'rm_component.js',
  ].forEach(script => {
    it(`throws exception when no args for "${script}"`, () => {
      expect(pureExecTool(script).code).to.equal(1);
    });
  });

  it('add feature component', () => {
    execTool('add_component.js test/test-component');
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
    expect(pureExecTool('add_component.js test/test-component').code).to.equal(1);
  });

  it('add common component', () => {
    execTool('add_component.js common-component');
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
    execTool('rm_component.js test/test-component');
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
    execTool('rm_component.js common-component');
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
