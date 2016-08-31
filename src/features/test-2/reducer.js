import {
  TEST_2_TEST_ACTION,
  MY_ASYNC_ACTION_BEGIN,
  MY_ASYNC_ACTION_SUCCESS,
  MY_ASYNC_ACTION_FAILURE,
  MY_ASYNC_ACTION_DISMISS_ERROR,
} from './constants';

const initialState = {
  myAsyncActionError: null,
  myAsyncActionPending: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TEST_2_TEST_ACTION:
      return {
        ...state,
      };

    /* ===== MyAsyncAction ===== */
    case MY_ASYNC_ACTION_BEGIN:
      return {
        ...state,
        myAsyncActionPending: true,
        myAsyncActionError: null,
      };

    case MY_ASYNC_ACTION_SUCCESS:
      return {
        ...state,
        myAsyncActionPending: false,
        myAsyncActionError: null,
      };

    case MY_ASYNC_ACTION_FAILURE:
      return {
        ...state,
        myAsyncActionPending: false,
        myAsyncActionError: action.data.error,
      };

    case MY_ASYNC_ACTION_DISMISS_ERROR:
      return {
        ...state,
        myAsyncActionError: null,
      };

    default:
      return state;
  }
}

