'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const core = require('../core');

const vio = core.vio;
const utils = core.utils;
const entry = core.entry;

const expectLines = helpers.expectLines;
const expectNoLines = helpers.expectNoLines;
const TEST_FEATURE_NAME = helpers.TEST_FEATURE_NAME;

const mapFeatureFile = _.partial(utils.mapFeatureFile, TEST_FEATURE_NAME);

describe('entry', function() { // eslint-disable-line
  before(() => {
    vio.reset();
    core.addFeature(TEST_FEATURE_NAME);
  });

  describe('handles: index.js', () => {
    // index.js
    it('addToIndex should add export from correctly', () => {
      entry.addToIndex(TEST_FEATURE_NAME, 'testEntry');
      expectLines(mapFeatureFile('index.js'), [
        "export { default as testEntry } from './testEntry';",
      ]);
    });

    it('renameInIndex should rename export from correctly', () => {
      entry.renameInIndex(TEST_FEATURE_NAME, 'testEntry', 'newName');
      expectNoLines(mapFeatureFile('index.js'), [
        "export { default as testEntry } from './testEntry';",
      ]);
      expectLines(mapFeatureFile('index.js'), [
        "export { default as newName } from './newName';",
      ]);
    });

    it('removeFromIndex should remove export from correctly', () => {
      entry.removeFromIndex(TEST_FEATURE_NAME, 'newName');
      expectNoLines(mapFeatureFile('index.js'), [
        "export { default as newName } from './newName';",
      ]);
    });
  });

  describe('handles: redux/actions.js', () => {
    // redux/actions.js
    const targetPath = mapFeatureFile('redux/actions.js');
    it('addToActions should add export from correctly', () => {
      entry.addToActions(TEST_FEATURE_NAME, 'testAction');
      expectLines(targetPath, [
        "export { testAction } from './testAction';",
      ]);
    });

    it('renameInActions should rename export from correctly', () => {
      entry.renameInActions(TEST_FEATURE_NAME, 'testAction', 'newName');
      expectNoLines(targetPath, [
        "export { testAction } from './testAction';",
      ]);
      expectLines(targetPath, [
        "export { newName } from './newName';",
      ]);
    });

    it('removeFromActions should remove export from correctly', () => {
      entry.removeFromActions(TEST_FEATURE_NAME, 'newName');
      expectNoLines(targetPath, [
        "export { newName } from './newName';",
      ]);
    });

    it('removeFromActions should be empty to produce empty file', () => {
      entry.removeFromActions(TEST_FEATURE_NAME, 'sample-action');
      expectNoLines(targetPath, [
        "sampleAction",
      ]);
    });
  });

  describe('handles: redux/reducer.js', () => {
    const targetPath = mapFeatureFile('redux/reducer.js');
    it('addToReducer should import entry and insert to reducers array', () => {
      entry.addToReducer(TEST_FEATURE_NAME, 'testAction');
      expectLines(targetPath, [
        "import { reducer as testActionReducer } from './testAction';",
        '  testActionReducer,',
      ]);
    });
    it('renameInReducer should rename entry and rename in reducers array', () => {
      entry.renameInReducer(TEST_FEATURE_NAME, 'testAction', 'newAction');
      expectLines(targetPath, [
        "import { reducer as newActionReducer } from './newAction';",
        '  newActionReducer,',
      ]);
    });
    it('removeFromReducer should remove entry and remove from reducers array', () => {
      entry.removeFromReducer(TEST_FEATURE_NAME, 'testAction');
      expectNoLines(targetPath, [
        "import { reducer as testActionReducer } from './testAction';",
        '  testActionReducer,',
      ]);
    });
  });

  describe('handles: redux/initialState.js', () => {
    const targetPath = mapFeatureFile('redux/initialState.js');
    it('addToInitialState should add initial state property', () => {
      entry.addToInitialState(TEST_FEATURE_NAME, 'someState', 'false');
      expectLines(targetPath, [
        '  someState: false,',
      ]);
    });
    it('renameInInitialState should rename state name', () => {
      entry.renameInInitialState(TEST_FEATURE_NAME, 'someState', 'newState');
      expectLines(targetPath, [
        '  newState: false,',
      ]);
    });

    it('removeFromInitialState should remove the state property', () => {
      entry.removeFromInitialState(TEST_FEATURE_NAME, 'newState');
      expectNoLines(targetPath, [
        '  newState: false,',
      ]);
    });
  });

  describe('handles: common/rootReducer.js', () => {
    const targetPath = utils.mapSrcFile('common/rootReducer.js');

    it('addToRootReducer should import feature reducer and combine it', () => {
      vio.put(targetPath, `
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';

const reducerMap = {
  routing: routerReducer,
  home: homeReducer,
  common: commonReducer,
};

export default combineReducers(reducerMap);
    `);
      entry.addToRootReducer('new-feature');
      expectLines(targetPath, [
        "import newFeatureReducer from '../features/new-feature/redux/reducer';",
        '  newFeature: newFeatureReducer,',
      ]);
    });
    it('renameInRootReducer should rename entry and rename in reducers array', () => {
      entry.renameInRootReducer('new-feature', 'renamed-new-feature');
      expectLines(targetPath, [
        "import renamedNewFeatureReducer from '../features/renamed-new-feature/redux/reducer';",
        '  renamedNewFeature: renamedNewFeatureReducer,',
      ]);
    });
    it('removeFromRootReducer should rename entry and rename in reducers array', () => {
      entry.removeFromRootReducer('renamed-new-feature');
      expectNoLines(targetPath, [
        "import renamedNewFeatureReducer from '../features/renamed-new-feature/redux/reducer';",
        '  renamedNewFeature: renamedNewFeatureReducer,',
      ]);
    });
  });

  describe('handles: common/routeConfig.js', () => {
    const targetPath = utils.mapSrcFile('common/routeConfig.js');

    it('addToRouteConfig should import feature route and combine it', () => {
      vio.put(targetPath, `
import App from '../containers/App';
import { PageNotFound } from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';

const childRoutes = [
  homeRoute,
  commonRoute,
];

const routes = [{
  path: '/',
  component: App,
  childRoutes: [
    ...childRoutes,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0)),
}];

export default routes;
    `);
      entry.addToRouteConfig('new-feature');
      expectLines(targetPath, [
        "import newFeatureRoute from '../features/new-feature/route';",
        '  newFeatureRoute,',
      ]);
    });

    it('renameInRouteConfig should rename entry and rename in routes array', () => {
      entry.renameInRouteConfig('new-feature', 'renamed-new-feature');
      expectLines(targetPath, [
        "import renamedNewFeatureRoute from '../features/renamed-new-feature/route';",
        '  renamedNewFeatureRoute,',
      ]);
    });
    it('removeFromRouteConfig should rename entry and rename in routes array', () => {
      entry.removeFromRouteConfig('renamed-new-feature');
      expectNoLines(targetPath, [
        "import renamedNewFeatureRoute from '../features/renamed-new-feature/route';",
        '  renamedNewFeatureRoute,',
      ]);
    });
  });

  describe('handles: style.less', () => {
    const targetPath = mapFeatureFile('style.less');
    it('addToStyle should add style import correctly', () => {
      entry.addToStyle(TEST_FEATURE_NAME, 'TestEntry');
      expectLines(targetPath, [
        "@import './TestEntry';",
      ]);
    });

    it('renameInStyle should rename style import correctly', () => {
      entry.renameInStyle(TEST_FEATURE_NAME, 'TestEntry', 'newName');
      expectNoLines(targetPath, [
        "@import './TestEntry';",
      ]);
      expectLines(targetPath, [
        "@import './newName';",
      ]);
    });

    it('removeFromStyle should remove style import correctly', () => {
      entry.removeFromStyle(TEST_FEATURE_NAME, 'newName');
      expectNoLines(targetPath, [
        "@import './newName';",
      ]);
    });
  });

  describe('handles: styles/index.less', () => {
    const targetPath = utils.mapSrcFile('styles/index.less');
    vio.put(targetPath, `
@import './reset.css';
@import './global';
@import '../containers/style';
@import '../features/home/style';
@import '../features/common/style';
    `);
    it('addToRootStyle should add style import correctly', () => {
      entry.addToRootStyle('new-feature');
      expectLines(targetPath, [
        "@import '../features/new-feature/style';",
      ]);
    });

    it('renameInRootStyle should rename style import correctly', () => {
      entry.renameInRootStyle('new-feature', 'renamed-new-feature');
      expectNoLines(targetPath, [
        "@import '../features/new-feature/style';",
      ]);
      expectLines(targetPath, [
        "@import '../features/renamed-new-feature/style';",
      ]);
    });

    it('removeFromRootStyle should remove style import correctly', () => {
      entry.removeFromRootStyle('renamed-new-feature');
      expectNoLines(targetPath, [
        "@import '../features/renamed-new-feature/style';",
      ]);
    });
  });
});
