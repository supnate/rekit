import {
  HOME_A_1_BEGIN,
  HOME_A_1_SUCCESS,
  HOME_A_1_FAILURE,
  HOME_A_1_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions:
// https://github.com/gaearon/redux-thunk
export function a1(args = {}) {
  return (dispatch) => { // optionally you could have getState as the second parameter
    dispatch({
      type: HOME_A_1_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise(async (resolve, reject) => {
      let res;
      try {
        // Below is just a demo of async operation, please replace it with your own.
        // 'args.error' here is only used for demo of error handling in tests, please also remove it and use your own.
        res = await new Promise((resolve2, reject2) => setTimeout(() => (args.error ? reject2('error') : resolve2('success')), 20));
      } catch (err) {
        dispatch({
          type: HOME_A_1_FAILURE,
          data: { error: err },
        });
        reject(err);
        return;
      }

      // Put success action dispatch out of try/catch so that rendering errors are not converted to failure actions.
      dispatch({
        type: HOME_A_1_SUCCESS,
        data: res,
      });
      resolve(res);
    });

    return promise;
  };
}

export function dismissA1Error() {
  return {
    type: HOME_A_1_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_A_1_BEGIN:
      return {
        ...state,
        a1Pending: true,
        a1Error: null,
      };

    case HOME_A_1_SUCCESS:
      return {
        ...state,
        a1Pending: false,
        a1Error: null,
      };

    case HOME_A_1_FAILURE:
      return {
        ...state,
        a1Pending: false,
        a1Error: action.data.error,
      };

    case HOME_A_1_DISMISS_ERROR:
      return {
        ...state,
        a1Error: null,
      };

    default:
      return state;
  }
}
