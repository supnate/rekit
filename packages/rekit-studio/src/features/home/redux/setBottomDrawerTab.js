// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import { storage } from '../../common/utils';
import {
  HOME_SET_BOTTOM_DRAWER_TAB,
} from './constants';

export function setBottomDrawerTab(key) {
  storage.local.setItem('bottomDrawerTab', key);
  return {
    type: HOME_SET_BOTTOM_DRAWER_TAB,
    payload: { key }
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_BOTTOM_DRAWER_TAB:
      return {
        ...state,
        bottomDrawerTab: action.payload.key,
      };

    default:
      return state;
  }
}
