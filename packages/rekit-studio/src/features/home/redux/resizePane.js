// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_RESIZE_PANE,
} from './constants';

export function resizePane(paneId, size) {
  return {
    type: HOME_RESIZE_PANE,
    payload: {
      paneId, size
    }
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_RESIZE_PANE:
      return {
        ...state,
        paneSize: {
          ...state.paneSize,
          [state.payload.paneId]: state.payload.size,
        },
      };

    default:
      return state;
  }
}
