import fetch from 'isomorphic-fetch';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import {
  HOME_FETCH_REDDIT_BY_SAGA_BEGIN,
  HOME_FETCH_REDDIT_BY_SAGA_SUCCESS,
  HOME_FETCH_REDDIT_BY_SAGA_FAILURE,
} from '../constants';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchList() {
  try {
    const res = yield call(fetch, 'http://www.reddit.com/r/reactjs.json');
    if (res.ok) {
      const json = yield call(() => res.json());
      yield put({
        type: HOME_FETCH_REDDIT_BY_SAGA_SUCCESS,
        data: json,
      });
    } else {
      throw new Error(res);
    }
  } catch (err) {
    yield put({
      type: HOME_FETCH_REDDIT_BY_SAGA_FAILURE,
      data: {},
    });
  }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* fetchRedditBySaga() {
  yield takeLatest(HOME_FETCH_REDDIT_BY_SAGA_BEGIN, fetchList);
}

export default fetchRedditBySaga;
