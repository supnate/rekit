// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

// Set the content of some url path has changed.
import { HOME_SET_URL_PATH_CHANGED } from './constants';

export function setUrlPathChanged(urlPath, changed) {
  return {
    type: HOME_SET_URL_PATH_CHANGED,
    payload: { urlPath, changed },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_URL_PATH_CHANGED:
      return {
        ...state,
        urlPathChanged: {
          ...state.urlPathChanged,
          [action.payload.urlPath]: action.payload.changed,
        },
      };

    default:
      return state;
  }
}
