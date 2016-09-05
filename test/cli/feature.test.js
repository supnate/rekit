'use strict';
const expect = require('chai').expect;
const helpers = require('./helpers');

const mapFile = helpers.mapFile;
const mapFeatureFile = helpers.mapFeatureFile;
const execTool = helpers.execTool;
const pureExecTool = helpers.pureExecTool;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;

describe('cli: feature test', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    // To reset test env
    execTool('rm_feature.js test');
  });

  it('throws exception when no args for "add_feature.js"', () => {
    expect(pureExecTool('add_feature.js').code).to.equal(1);
  });

  it('add test feature', () => {
    execTool('add_feature.js test');
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
      'import testReducer from \'../features/test/redux/reducer\';',
      '  test: testReducer,',
    ]);
    expectLines(mapFile('common/routeConfig.js'), [
      'import testRoute from \'../features/test/route\';',
      '    testRoute,',
    ]);
    expectLines(mapFile('styles/index.less'), [
      '@import \'../features/test/style.less\';',
    ]);
  });

  it('remove feature', () => {
    execTool('rm_feature.js test');
    expectNoFile(mapFile('test'));
    expectNoLines(mapFile('common/rootReducer.js'), [
      'testReducer',
    ]);
    expectNoLines(mapFile('common/routeConfig.js'), [
      'testRoute',
    ]);
    expectNoLines(mapFile('styles/index.less'), [
      '@import \'../features/test/style.less\';',
    ]);
  });

  it('no error when removing a feature does not exist.', () => {
    execTool('rm_feature.js feature-does-not-exist-test');
  });
});
