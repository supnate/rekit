import {
  COMMON_MY_SAGA_BEGIN,
  COMMON_MY_SAGA_SUCCESS,
  COMMON_MY_SAGA_FAILURE,
  COMMON_MY_SAGA_DISMISS_ERROR,
} from './constants';

export function mySaga(args) {
  return {
    type: COMMON_MY_SAGA_BEGIN,
  };
}

export function dismissMySagaError() {
  return {
    type: COMMON_MY_SAGA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_MY_SAGA_BEGIN:
      return {
        ...state,
        mySagaPending: true,
        mySagaError: null,
      };

    case COMMON_MY_SAGA_SUCCESS:
      return {
        ...state,
        mySagaPending: false,
        mySagaError: null,
      };

    case COMMON_MY_SAGA_FAILURE:
      return {
        ...state,
        mySagaPending: false,
        mySagaError: action.data.error,
      };

    case COMMON_MY_SAGA_DISMISS_ERROR:
      return {
        ...state,
        mySagaError: null,
      };

    default:
      return state;
  }
}
