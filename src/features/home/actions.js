import fetch from 'isomorphic-fetch';
import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from './constants';

export function counterPlusOne() {
  return {
    type: COUNTER_PLUS_ONE,
  };
}

export function counterMinusOne() {
  return {
    type: COUNTER_MINUS_ONE,
  };
}

export function resetCount() {
  return {
    type: RESET_COUNTER,
  };
}

/* ===== FetchRedditReactjsList ===== */
export function fetchRedditReactjsList() {
  return dispatch => {
    dispatch({
      type: FETCH_REDDIT_REACTJS_LIST_BEGIN,
    });
    return fetch('http://www.reddit.com/r/reactjs.json')
      .then(response => {
        if (response.status !== 200) {
          throw new Error('server error');
        }
        return response.json();
      })
      .then(json => {
        dispatch({
          type: FETCH_REDDIT_REACTJS_LIST_SUCCESS,
          data: json,
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_REDDIT_REACTJS_LIST_FAILURE,
          data: {
            error: err,
          },
        });
      });
  };
}

export function dismissFetchRedditReactjsListError() {
  return {
    type: FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
  };
}
