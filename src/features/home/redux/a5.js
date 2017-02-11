import {
  HOME_A_5_BEGIN,
  HOME_A_5_SUCCESS,
  HOME_A_5_FAILURE,
  HOME_A_5_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions:
// https://github.com/gaearon/redux-thunk
export function a5(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_A_5_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is for sample purpose, replace it with your own logic.
      const doRequest = new Promise((resolve2, reject2) => setTimeout(() => (args.error ? reject2('error') : resolve2('success')), 20));
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_A_5_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument of then so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_A_5_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissA5Error() {
  return {
    type: HOME_A_5_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_A_5_BEGIN:
      return {
        ...state,
        a5Pending: true,
        a5Error: null,
      };

    case HOME_A_5_SUCCESS:
      return {
        ...state,
        a5Pending: false,
        a5Error: null,
      };

    case HOME_A_5_FAILURE:
      return {
        ...state,
        a5Pending: false,
        a5Error: action.data.error,
      };

    case HOME_A_5_DISMISS_ERROR:
      return {
        ...state,
        a5Error: null,
      };

    default:
      return state;
  }
}
