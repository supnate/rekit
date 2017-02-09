import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from './constants';

export function ${_.camelCase(action)}() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: ${actionTypes.begin},
  };
}

export function dismiss${_.pascalCase(action)}Error() {
  return {
    type: ${actionTypes.dismissError},
  };
}

// worker Saga: will be fired on ${actionTypes.begin} actions
export function* do${_.pascalCase(action)}() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: ${actionTypes.failure},
      error: err,
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: ${actionTypes.success},
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent fetches of user. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watch${_.pascalCase(action)}() {
  yield takeLatest(${actionTypes.begin}, do${_.pascalCase(action)});
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case ${actionTypes.begin}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: true,
        ${_.camelCase(action)}Error: null,
      };

    case ${actionTypes.success}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: false,
        ${_.camelCase(action)}Error: null,
      };

    case ${actionTypes.failure}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: false,
        ${_.camelCase(action)}Error: action.data.error,
      };

    case ${actionTypes.dismissError}:
      return {
        ...state,
        ${_.camelCase(action)}Error: null,
      };

    default:
      return state;
  }
}
