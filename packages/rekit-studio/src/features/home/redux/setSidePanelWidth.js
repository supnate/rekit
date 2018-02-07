// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { HOME_SET_SIDE_PANEL_WIDTH } from './constants';

export function setSidePanelWidth(width) {
  if (width < 100) width = 100;
  if (width > 500) width = 500;
  localStorage.setItem('sidePanelWidth', width);
  return {
    type: HOME_SET_SIDE_PANEL_WIDTH,
    payload: { width },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_SIDE_PANEL_WIDTH:
      return {
        ...state,
        sidePanelWidth: action.payload.width,
      };

    default:
      return state;
  }
}
