import {
  TEST_2_TEST_ACTION,
  MY_ASYNC_ACTION_BEGIN,
  MY_ASYNC_ACTION_SUCCESS,
  MY_ASYNC_ACTION_FAILURE,
  MY_ASYNC_ACTION_DISMISS_ERROR,
} from './constants';

export function test2TestAction() {
  return {
    type: TEST_2_TEST_ACTION,
  };
}

/* ===== MyAsyncAction ===== */
export function myAsyncAction(args) {
  return dispatch => {
    dispatch({
      type: MY_ASYNC_ACTION_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: MY_ASYNC_ACTION_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: MY_ASYNC_ACTION_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 500);
    });

    return promise;
  };
}

export function dismissMyAsyncActionError() {
  return {
    type: MY_ASYNC_ACTION_DISMISS_ERROR,
  };
}
