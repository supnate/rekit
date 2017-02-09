import axios from 'axios';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_FETCH_REDDIT_BY_SAGA_BEGIN,
  HOME_FETCH_REDDIT_BY_SAGA_SUCCESS,
  HOME_FETCH_REDDIT_BY_SAGA_FAILURE,
  HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR,
} from './constants';

export function fetchRedditBySaga() {
  return {
    type: HOME_FETCH_REDDIT_BY_SAGA_BEGIN,
  };
}

export function dismissFetchRedditBySagaError() {
  return {
    type: HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR,
  };
}

// worker Saga: put async logic here.
function* doFetchRedditBySaga(action) {
  let res;
  try {
    res = yield call(axios.get, 'http://www.reddit.com/r/reactjs.json');
  } catch (err) {
    yield put({
      type: HOME_FETCH_REDDIT_BY_SAGA_FAILURE,
      data: {
        error: err,
      },
    });
    return;
  }
  yield put({
    type: HOME_FETCH_REDDIT_BY_SAGA_SUCCESS,
    data: res.data,
  });
}

/*
  Alternatively you may use takeEvery.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
export function* watchFetchRedditBySaga() {
  yield takeLatest(HOME_FETCH_REDDIT_BY_SAGA_BEGIN, doFetchRedditBySaga);
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_REDDIT_BY_SAGA_BEGIN:
      return {
        ...state,
        fetchRedditBySagaPending: true,
        fetchRedditBySagaError: null,
      };

    case HOME_FETCH_REDDIT_BY_SAGA_SUCCESS:
      return {
        ...state,
        fetchRedditBySagaPending: false,
        fetchRedditBySagaError: null,
        redditList: action.data.data.children
      };

    case HOME_FETCH_REDDIT_BY_SAGA_FAILURE:
      return {
        ...state,
        fetchRedditBySagaPending: false,
        fetchRedditBySagaError: action.data.error,
      };

    case HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR:
      return {
        ...state,
        fetchRedditBySagaError: null,
      };

    default:
      return state;
  }
}
