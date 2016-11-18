import {
  AA_1_BEGIN,
  AA_1_SUCCESS,
  AA_1_FAILURE,
  AA_1_DISMISS_ERROR,
} from './constants';

export function aa1(args) {
  return (dispatch) => {
    dispatch({
      type: AA_1_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: AA_1_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: AA_1_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismissAa1Error() {
  return {
    type: AA_1_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case AA_1_BEGIN:
      return {
        ...state,
        aa1Pending: true,
        aa1Error: null,
      };

    case AA_1_SUCCESS:
      return {
        ...state,
        aa1Pending: false,
        aa1Error: null,
      };

    case AA_1_FAILURE:
      return {
        ...state,
        aa1Pending: false,
        aa1Error: action.data.error,
      };

    case AA_1_DISMISS_ERROR:
      return {
        ...state,
        aa1Error: null,
      };

    default:
      return state;
  }
}
