import { takeEvery } from 'redux-saga';
import { call, put, delay } from 'redux-saga/effects';

import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
} from '../constants';

// worker Saga: will be fired on ${actionTypes.begin} actions
function* ${_.camelCase(action)}() {
  try {
    // Do Ajax call or other async operations here. delay(50) is only a placeholder.
    const res = yield delay(20);
    yield put({
      type: ${actionTypes.success},
      data: res,
    });
  } catch (err) {
    yield put({
      type: ${actionTypes.failure},
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
  yield takeEvery(${actionTypes.begin}, ${_.camelCase(action)});
}

export default saga;
