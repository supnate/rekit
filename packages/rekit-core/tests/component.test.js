'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;

const expectFiles = helpers.expectFiles;
const expectNoFiles = helpers.expectNoFiles;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;
const mapFeatureFile = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME);
const mapTestFile = _.partial(utils.mapTestFile, TEST_FEATURE_NAME);

describe('component', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
  });

  it('throw error when no args to add component', () => {
    expect(core.addComponent).to.throw(Error);
  });

  it('throw error when no args to remove component', () => {
    expect(core.removeComponent).to.throw(Error);
  });

  it('add component', () => {
    core.addComponent(TEST_FEATURE_NAME, 'test-component');
    expectFiles([
      'TestComponent.js',
      'TestComponent.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./TestComponent\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'export { default as TestComponent } from \'./TestComponent\';',
    ]);
    expectFiles([
      'TestComponent.test.js',
    ].map(mapTestFile));
  });

  it('throw error when component already exists', () => {
    expect(core.addComponent.bind(core, TEST_FEATURE_NAME, 'test-component')).to.throw();
  });

  it('add component connected to redux store', () => {
    core.addComponent(TEST_FEATURE_NAME, 'redux-component', { connect: true });
    expectLines(mapFeatureFile('ReduxComponent.js'), [
      "import { connect } from 'react-redux';",
    ]);
  });
  it('add component used in a route rule', () => {
    core.addComponent(TEST_FEATURE_NAME, 'route-component', { urlPath: '$auto' });
    expectLines(mapFeatureFile('route.js'), [
      "  RouteComponent,",
      "    { path: 'route-component', name: 'Route component', component: RouteComponent },",
    ]);
    core.addComponent(TEST_FEATURE_NAME, 'route-component-2', { urlPath: 'my-url' });
    expectLines(mapFeatureFile('route.js'), [
      "    { path: 'my-url', name: 'Route component 2', component: RouteComponent2 },",
    ]);
  });

  it('rename component', () => {
    const source = { feature: TEST_FEATURE_NAME, name: 'test-component' };
    const target = { feature: TEST_FEATURE_NAME, name: 'renamed-component' };
    core.moveComponent(source, target);

    expectNoFiles([
      'TestComponent.js',
      'TestComponent.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      'TestComponent.less'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'TestComponent',
    ]);
    expectNoFiles([
      'TestComponent.test.js',
    ].map(mapTestFile));

    expectFiles([
      'RenamedComponent.js',
      'RenamedComponent.less',
    ].map(mapFeatureFile));
    expectLines(mapFeatureFile('style.less'), [
      '@import \'./RenamedComponent\';'
    ]);
    expectLines(mapFeatureFile('index.js'), [
      'export { default as RenamedComponent } from \'./RenamedComponent\';',
    ]);
    expectFiles([
      'RenamedComponent.test.js',
    ].map(mapTestFile));

    // css class name
    expectNoLines(mapFeatureFile('RenamedComponent.less'), [
      `${TEST_FEATURE_NAME}-test-component`,
    ]);
    expectNoLines(mapFeatureFile('RenamedComponent.js'), [
      `${TEST_FEATURE_NAME}-test-component`,
    ]);
    expectLines(mapFeatureFile('RenamedComponent.less'), [
      `.${TEST_FEATURE_NAME}-renamed-component {`,
    ]);
    expectLines(mapFeatureFile('RenamedComponent.js'), [
      `      <div className="${TEST_FEATURE_NAME}-renamed-component">`,
    ]);
  });

  it('move component to a different feature', () => {
    const TEST_FEATURE_NAME_2 = `${TEST_FEATURE_NAME}-2`;
    core.addFeature(TEST_FEATURE_NAME_2);
    core.addComponent(TEST_FEATURE_NAME, 'test-component-2');

    const source = { feature: TEST_FEATURE_NAME, name: 'test-component-2' };
    const target = { feature: TEST_FEATURE_NAME_2, name: 'renamed-component-2' };
    core.moveComponent(source, target);

    expectNoFiles([
      'TestComponent2.js',
      'TestComponent2.less',
    ].map(mapFeatureFile));
    expectNoLines(mapFeatureFile('style.less'), [
      'TestComponent2.less'
    ]);
    expectNoLines(mapFeatureFile('index.js'), [
      'TestComponent2',
    ]);
    expectNoFiles([
      'TestComponent2.test.js',
    ].map(mapTestFile));

    const mapFeatureFile2 = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME_2);
    const mapTestFile2 = _.partial(utils.mapTestFile, TEST_FEATURE_NAME_2);
    expectFiles([
      'RenamedComponent2.js',
      'RenamedComponent2.less',
    ].map(mapFeatureFile2));
    expectLines(mapFeatureFile2('style.less'), [
      '@import \'./RenamedComponent2\';'
    ]);
    expectLines(mapFeatureFile2('index.js'), [
      'export { default as RenamedComponent2 } from \'./RenamedComponent2\';',
    ]);
    expectFiles([
      'RenamedComponent2.test.js',
    ].map(mapTestFile2));

    // css class name
    expectNoLines(mapFeatureFile2('RenamedComponent2.less'), [
      `${TEST_FEATURE_NAME_2}-test-component-2`,
    ]);
    expectNoLines(mapFeatureFile2('RenamedComponent2.js'), [
      `${TEST_FEATURE_NAME_2}-test-component-2`,
    ]);
    expectLines(mapFeatureFile2('RenamedComponent2.less'), [
      `.${TEST_FEATURE_NAME_2}-renamed-component-2 {`,
    ]);
    expectLines(mapFeatureFile2('RenamedComponent2.js'), [
      `      <div className="${TEST_FEATURE_NAME_2}-renamed-component-2">`,
    ]);
  });

  it('remove component', () => {
    core.removeComponent(TEST_FEATURE_NAME, 'test-component');
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
    ].map(mapTestFile));
  });
});
