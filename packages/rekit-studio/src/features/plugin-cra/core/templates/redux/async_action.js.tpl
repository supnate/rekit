import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function ${ele.name}(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ${actionTypes.begin},
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: ${actionTypes.success},
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ${actionTypes.failure},
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
export function dismiss${utils.pascalCase(ele.name)}Error() {
  return {
    type: ${actionTypes.dismissError},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ${actionTypes.begin}:
      // Just after a request is sent
      return {
        ...state,
        ${ele.name}Pending: true,
        ${ele.name}Error: null,
      };

    case ${actionTypes.success}:
      // The request is success
      return {
        ...state,
        ${ele.name}Pending: false,
        ${ele.name}Error: null,
      };

    case ${actionTypes.failure}:
      // The request is failed
      return {
        ...state,
        ${ele.name}Pending: false,
        ${ele.name}Error: action.data.error,
      };

    case ${actionTypes.dismissError}:
      // Dismiss the request failure error
      return {
        ...state,
        ${ele.name}Error: null,
      };

    default:
      return state;
  }
}
