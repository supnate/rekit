// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CORE_SHOW_DIALOG,
} from './constants';

export function showDialog(formId, title, context) {
  return {
    type: CORE_SHOW_DIALOG,
    payload: { formId, title, context },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CORE_SHOW_DIALOG:
      return {
        ...state,
        dialog: {
          visible: true,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}
