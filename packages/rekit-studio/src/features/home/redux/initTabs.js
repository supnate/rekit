// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_INIT_TABS,
} from './constants';

export function initTabs() {
  return {
    type: HOME_INIT_TABS,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_INIT_TABS:
      return {
        ...state,
      };

    default:
      return state;
  }
}
