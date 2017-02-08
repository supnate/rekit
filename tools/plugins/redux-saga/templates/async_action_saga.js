import { delay, takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from './constants';

export function ${_.camelCase(action)}(args) {
  return {
    type: ${actionTypes.begin},
  };
}

export function dismiss${_.pascalCase(action)}Error() {
  return {
    type: ${actionTypes.dismissError},
  };
}

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

// worker Saga: will be fired on ${actionTypes.begin} actions
export function* ${_.camelCase(action)}BySaga() {
  let res;
  try {
    // Do Ajax call or other async operations here. delay(50) is only a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: ${actionTypes.failure},
      error: err,
    });
    return;
  }
  yield put({
    type: ${actionTypes.success},
    data: res,
  });
}

/*
  Alternatively you may use takeLatest.
*/
function* watch${_.pascalCase(action)}() {
  yield takeLatest(${actionTypes.begin}, ${_.camelCase(action)});
}

export default watch${_.pascalCase(action)};