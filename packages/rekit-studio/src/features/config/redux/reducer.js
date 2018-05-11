// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.
import _ from 'lodash';
import initialState from './initialState';
import { reducer as fetchDepsReducer } from './fetchDeps';
import { reducer as installPackageReducer } from './installPackage';
import { reducer as updatePackageReducer } from './updatePackage';
import { reducer as removePackageReducer } from './removePackage';
import { reducer as setDepsOutputHeightReducer } from './setDepsOutputHeight';
import { reducer as fetchDepsRemoteReducer } from './fetchDepsRemote';

const reducers = [
  fetchDepsReducer,
  installPackageReducer,
  updatePackageReducer,
  removePackageReducer,
  setDepsOutputHeightReducer,
  fetchDepsRemoteReducer,
];

export default function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'REKIT_STUDIO_OUTPUT': {
      if (!/install-package|remove-package|update-package/.test(action.data.type)) {
        break;
      }
      const newDepStatus = {
        ...state.depStatus,
        [`${_.camelCase(action.data.type)}!${action.data.params.name}`]: true,
      };

      newState = {
        ...state,
        depStatus: newDepStatus,
      };
      break;
    }
    case 'REKIT_TASK_FINISHED': {
      if (!/install-package|remove-package|update-package/.test(action.data.type)) {
        break;
      }
      const newDepStatus = {
        ...state.depStatus,
        [`${_.camelCase(action.data.type)}!${action.data.params.name}`]: false,
      };

      newState = {
        ...state,
        depStatus: newDepStatus,
      };
      break;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
