// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { CORE_HIDE_DIALOG } from './constants';

export function hideDialog(formId) {
  return {
    type: CORE_HIDE_DIALOG,
    payload: { formId },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CORE_HIDE_DIALOG:
      return {
        ...state,
        dialog: {
          visible: false,
          title: null,
          formId: null,
        }
      };

    default:
      return state;
  }
}
