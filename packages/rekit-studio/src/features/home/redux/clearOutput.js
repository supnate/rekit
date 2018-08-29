// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_CLEAR_OUTPUT,
} from './constants';

export function clearOutput() {
  return {
    type: HOME_CLEAR_OUTPUT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CLEAR_OUTPUT:
      return {
        ...state,
        output: [],
      };

    default:
      return state;
  }
}
