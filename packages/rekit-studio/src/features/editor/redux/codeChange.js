// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  EDITOR_CODE_CHANGE,
} from './constants';

export function codeChange() {
  return {
    type: EDITOR_CODE_CHANGE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case EDITOR_CODE_CHANGE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
