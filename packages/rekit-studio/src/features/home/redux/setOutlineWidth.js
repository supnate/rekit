// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_SET_OUTLINE_WIDTH,
} from './constants';

export function setOutlineWidth() {
  return {
    type: HOME_SET_OUTLINE_WIDTH,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_OUTLINE_WIDTH:
      return {
        ...state,
      };

    default:
      return state;
  }
}
