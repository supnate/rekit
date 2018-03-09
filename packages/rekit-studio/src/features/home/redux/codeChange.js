// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_CODE_CHANGE,
} from './constants';

export function codeChange() {
  return {
    type: HOME_CODE_CHANGE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CODE_CHANGE:
      return {
        ...state,
        codeChange: state.codeChange + 1,
      };

    default:
      return state;
  }
}
