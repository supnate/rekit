import { takeEvery } from 'redux-saga';
import { call, put, delay } from 'redux-saga/effects';

import {
  COMMON_MY_SAGA_BEGIN,
  COMMON_MY_SAGA_SUCCESS,
  COMMON_MY_SAGA_FAILURE,
} from '../constants';

// worker Saga: will be fired on COMMON_MY_SAGA_BEGIN actions
function* mySaga() {
  try {
    // Do Ajax call or other async operations here. delay(50) is only a placeholder.
    const res = yield delay(50);
    yield put({
      type: COMMON_MY_SAGA_SUCCESS,
      data: res,
    });
  } catch (err) {
    yield put({
      type: COMMON_MY_SAGA_FAILURE,
      data: {
        error: err,
      },
    });
  }
}

/*
  Alternatively you may use takeLatest.
*/
function* saga() {
  yield takeEvery(COMMON_MY_SAGA_BEGIN, mySaga);
}

export default saga;
