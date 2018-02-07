// This file is auto maintained by Rekit, you usually don't need to edit it manually.

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import rekitCmdsReducer from '../features/rekit-cmds/redux/reducer';
import diagramReducer from '../features/diagram/redux/reducer';
import rekitToolsReducer from '../features/rekit-tools/redux/reducer';

// NOTE 1: DO NOT CHANGE the 'reducerMap' name and the declaration pattern.
// This is used for Rekit cmds to register new features, remove features, etc.

// NOTE 2: always use the camel case of the feature folder name as the store branch name
// So that it's easy for others to understand it and Rekit could manage theme.

const reducerMap = {
  router: routerReducer,
  home: homeReducer,
  common: commonReducer,
  rekitCmds: rekitCmdsReducer,
  diagram: diagramReducer,
  rekitTools: rekitToolsReducer,
};

export default combineReducers(reducerMap);
