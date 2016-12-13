import { delay, takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
} from '../constants';

// worker Saga: will be fired on ${actionTypes.begin} actions
export function* ${_.camelCase(action)}() {
  try {
    // Do Ajax call or other async operations here. delay(50) is only a placeholder.
    const res = yield call(delay, 20);
    yield put({
      type: ${actionTypes.success},
      data: res,
    });
  } catch (err) {
    yield put({
      type: ${actionTypes.failure},
      error: err,
    });
  }
}

/*
  Alternatively you may use takeLatest.
*/
function* watch${_.pascalCase(action)}() {
  yield takeEvery(${actionTypes.begin}, ${_.camelCase(action)});
}

export default watch${_.pascalCase(action)};
