import axios from 'axios';
import {
  HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN,
  HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE,
  HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from './constants';

export function fetchRedditReactjsList() {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN,
    });
    return new Promise((resolve, reject) => {
      axios.get('http://www.reddit.com/r/reactjs.json').then(
        (res) => {
          dispatch({
            type: HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        (err) => {
          dispatch({
            type: HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });
  };
}

export function dismissFetchRedditReactjsListError() {
  return {
    type: HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN:
      return {
        ...state,
        fetchRedditReactjsListPending: true,
        fetchRedditReactjsListError: null,
      };

    case HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS:
      return {
        ...state,
        fetchRedditReactjsListPending: false,
        fetchRedditReactjsListError: null,
        redditReactjsList: action.data.data.children
      };

    case HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE:
      return {
        ...state,
        fetchRedditReactjsListPending: false,
        fetchRedditReactjsListError: action.data.error,
      };

    case HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchRedditReactjsListError: null,
      };

    default:
      return state;
  }
}
