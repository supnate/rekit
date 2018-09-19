// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  PLUGIN_DEFAULT_SET_PROBLEMS,
} from './constants';

export function setProblems() {
  return {
    type: PLUGIN_DEFAULT_SET_PROBLEMS,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_DEFAULT_SET_PROBLEMS:
      return {
        ...state,
      };

    default:
      return state;
  }
}
