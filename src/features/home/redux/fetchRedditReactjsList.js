import fetch from 'isomorphic-fetch';
import {
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from './constants';

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

export function reducer(state = {}, action) {
  switch (action.type) {
    /* ===== FetchRedditReactjsList ===== */
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
