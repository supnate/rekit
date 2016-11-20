'use strict';

const expect = require('chai').expect;
const helpers = require('./helpers');
const rekit = require('../../tools/lib/rekit');
const vio = require('../../tools/lib/vio');

const mapFeatureFile = helpers.mapFeatureFile;
const mapFeatureTestFile = helpers.mapFeatureTestFile;
const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

describe('cli: component tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    rekit.addFeature(TEST_FEATURE_NAME);
  });

  after(() => {
    vio.reset();
  });

  it('throw error when no args to add component', () => {
    expect(rekit.addComponent).to.throw(Error);
  });

  it('throw error when no args to remove component', () => {
    expect(rekit.removeComponent).to.throw(Error);
  });

  it('add component', () => {
    rekit.addComponent(TEST_FEATURE_NAME, 'test-component');
    expectFiles([
      'TestComponent.js',
      'TestComponent.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestComponent.less\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'export TestComponent from \'./TestComponent\';',
    ]);
    expectFiles([
      'TestComponent.test.js',
    ].map(mapFeatureTestFile));
  });

  it('throw error when component already exists', () => {
    expect(rekit.addComponent.bind(rekit, TEST_FEATURE_NAME, 'test-component')).to.throw();
  });

  it('remove component', () => {
    rekit.removeComponent(TEST_FEATURE_NAME, 'test-component');
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
    expectNoFiles([
      'TestComponent.test.js',
    ].map(mapFeatureTestFile));
  });
});
