'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;
const route = core.route;

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;
const TEST_FEATURE_NAME_2 = helpers.TEST_FEATURE_NAME_2;

const mapFeatureFile = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME);
const mapFeatureFile2 = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME_2);

describe('route', function() { // eslint-disable-line
  const targetPath = mapFeatureFile('route.js');
  const targetPath2 = mapFeatureFile2('route.js');
  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
    core.addFeature(TEST_FEATURE_NAME_2);
  });

  it('add route for a component', () => {
    route.add(TEST_FEATURE_NAME, 'test-component');
    expectLines(targetPath, [
      "  TestComponent,",
      "    { path: 'test-component', name: 'Test component', component: TestComponent },",
    ]);
  });

  it('remove route for a component', () => {
    route.remove(TEST_FEATURE_NAME, 'test-component');
    expectNoLines(targetPath, [
      "TestComponent",
      "component: TestComponent },",
    ]);
  });

  it('add route for a component with custom url path', () => {
    route.add(TEST_FEATURE_NAME, 'test-component-2', { urlPath: 'my-url' });
    expectLines(targetPath, [
      "  TestComponent2,",
      "    { path: 'my-url', name: 'Test component 2', component: TestComponent2 },",
    ]);
  });

  it('rename route for a component', () => {
    route.add(TEST_FEATURE_NAME, 'to-rename');
    const source = { feature: TEST_FEATURE_NAME, name: 'to-rename' };
    const target = { feature: TEST_FEATURE_NAME, name: 'renamed-component' };
    route.move(source, target);
    expectNoLines(targetPath, [
      "ToRename",
    ]);
    expectLines(targetPath, [
      "  RenamedComponent,",
      "    { path: 'renamed-component', name: 'Renamed component', component: RenamedComponent },",
    ]);
  });

  it('move route to a different feature', () => {
    const source = { feature: TEST_FEATURE_NAME, name: 'test-component-2' };
    const target = { feature: TEST_FEATURE_NAME_2, name: 'renamed-component-2' };
    route.move(source, target);
    expectNoLines(targetPath, [
      "TestComponent2",
    ]);
    expectLines(targetPath2, [
      "  RenamedComponent2,",
      "    { path: 'my-url', name: 'Renamed component 2', component: RenamedComponent2 },",
    ]);
  });

  it('move route to a differnt feature should brings path and name together', () => {
    route.add(TEST_FEATURE_NAME, 'to-move');
    const source = { feature: TEST_FEATURE_NAME, name: 'to-move' };
    const target = { feature: TEST_FEATURE_NAME_2, name: 'to-move-done' };
    // simulate manually edit route
    vio.put(targetPath, vio.getContent(targetPath)
      .replace("path: 'to-move'", "path: '/to/move'")
      .replace("name: 'To move'", "name: 'A new name'")
    );
    route.move(source, target);
    expectLines(targetPath2, [
      "  ToMoveDone,",
      "    { path: '/to/move', name: 'A new name', component: ToMoveDone },",
    ]);
  });

  it('remove route for a component', () => {
    route.remove(TEST_FEATURE_NAME, 'renamed-component');
    expectNoLines(targetPath, [
      "RenamedComponent",
      "component: RenamedComponent },",
    ]);
  });
});
