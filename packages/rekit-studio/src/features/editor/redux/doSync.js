// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  EDITOR_DO_SYNC,
} from './constants';

export function doSync() {
  return {
    type: EDITOR_DO_SYNC,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case EDITOR_DO_SYNC:
      return {
        ...state,
      };

    default:
      return state;
  }
}
