// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

// Set the content of some url path has changed.
import { HOME_SET_VIEW_CHANGED } from './constants';

export function setViewChanged(urlPath, changed) {
  return {
    type: HOME_SET_VIEW_CHANGED,
    payload: { urlPath, changed },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_VIEW_CHANGED:{
      const { urlPath, changed } = action.payload;
      if (state.viewChanged[urlPath] === changed) return state;
      return {
        ...state,
        viewChanged: {
          ...state.viewChanged,
          [urlPath]: changed,
        },
      };
    }

    default:
      return state;
  }
}
