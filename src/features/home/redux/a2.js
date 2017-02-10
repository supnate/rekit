import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_A_2_BEGIN,
  HOME_A_2_SUCCESS,
  HOME_A_2_FAILURE,
  HOME_A_2_DISMISS_ERROR,
} from './constants';

export function a2() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_A_2_BEGIN,
  };
}

export function dismissA2Error() {
  return {
    type: HOME_A_2_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_A_2_BEGIN actions
export function* doA2() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: HOME_A_2_FAILURE,
      error: err,
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_A_2_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent fetches of user. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchA2() {
  yield takeLatest(HOME_A_2_BEGIN, doA2);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_A_2_BEGIN:
      return {
        ...state,
        a2Pending: true,
        a2Error: null,
      };

    case HOME_A_2_SUCCESS:
      return {
        ...state,
        a2Pending: false,
        a2Error: null,
      };

    case HOME_A_2_FAILURE:
      return {
        ...state,
        a2Pending: false,
        a2Error: action.data.error,
      };

    case HOME_A_2_DISMISS_ERROR:
      return {
        ...state,
        a2Error: null,
      };

    default:
      return state;
  }
}
