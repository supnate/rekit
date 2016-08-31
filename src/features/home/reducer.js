import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from './constants';

const initialState = {
  count: 0,
  redditReactjsList: [],
  fetchRedditReactjsListError: null,
  fetchRedditReactjsListPending: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    case COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    case RESET_COUNTER:
      return {
        ...state,
        count: 0,
      };

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
