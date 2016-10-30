import fetch from 'isomorphic-fetch';
import {
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from './constants';

export function fetchRedditReactjsList() {
  return dispatch => {
    dispatch({
      type: FETCH_REDDIT_REACTJS_LIST_BEGIN,
    });
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('http://www.reddit.com/r/reactjs.json');
        if (res.ok) {
          const json = await res.json();
          dispatch({
            type: FETCH_REDDIT_REACTJS_LIST_SUCCESS,
            data: json,
          });
          resolve(json);
        } else {
          throw new Error(res);
        }
      } catch (err) {
        dispatch({
          type: FETCH_REDDIT_REACTJS_LIST_FAILURE,
          data: {},
        });
        reject(err);
      }
    }).catch(() => {});
  };
}

export function dismissFetchRedditReactjsListError() {
  return {
    type: FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case FETCH_REDDIT_REACTJS_LIST_BEGIN:
      return {
        ...state,
        fetchRedditReactjsListPending: true,
        fetchRedditReactjsListError: null,
      };

    case FETCH_REDDIT_REACTJS_LIST_SUCCESS:
      return {
        ...state,
        fetchRedditReactjsListPending: false,
        fetchRedditReactjsListError: null,
        redditReactjsList: action.data.data.children
      };

    case FETCH_REDDIT_REACTJS_LIST_FAILURE:
      return {
        ...state,
        fetchRedditReactjsListPending: false,
        fetchRedditReactjsListError: action.data.error,
      };

    case FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchRedditReactjsListError: null,
      };

    default:
      return state;
  }
}
