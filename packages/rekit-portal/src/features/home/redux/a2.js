import {
  HOME_A_2_BEGIN,
  HOME_A_2_SUCCESS,
  HOME_A_2_FAILURE,
  HOME_A_2_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function a2(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_A_2_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a sample which resolves promise in 20ms. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      const doRequest = new Promise((resolve2, reject2) => setTimeout(() => (args.error ? reject2('error') : resolve2('success')), 20));
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_A_2_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_A_2_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissA2Error() {
  return {
    type: HOME_A_2_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_A_2_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        a2Pending: true,
        a2Error: null,
      };

    case HOME_A_2_SUCCESS:
      // The request is success
      return {
        ...state,
        a2Pending: false,
        a2Error: null,
      };

    case HOME_A_2_FAILURE:
      // The request is failed
      return {
        ...state,
        a2Pending: false,
        a2Error: action.data.error,
      };

    case HOME_A_2_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        a2Error: null,
      };

    default:
      return state;
  }
}
