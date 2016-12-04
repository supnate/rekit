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
        redditReactjsList: action.data.data.children
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
