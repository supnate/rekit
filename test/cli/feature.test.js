'use strict';
const helpers = require('./helpers');

const mapFile = helpers.mapFile;
const mapFeatureFile = helpers.mapFeatureFile;
const exec = helpers.exec;
const expectFiles = helpers.expectFiles;
const expectNoFile = helpers.expectNoFile;
const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;


describe('cli: feature test', function() { // eslint-disable-line
  this.timeout(20000);

  before(() => {
    // To reset test env
    exec('npm run rm:feature test');
  });

  it('add test feature', () => {
    exec('npm run add:feature test');
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
    exec('npm run rm:feature test');
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
    exec('npm run rm:feature feature-does-not-exist-test');
  });
});
