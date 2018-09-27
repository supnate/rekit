import axios from 'axios';
import {
  HOME_FETCH_FILE_CONTENT_BEGIN,
  HOME_FETCH_FILE_CONTENT_SUCCESS,
  HOME_FETCH_FILE_CONTENT_FAILURE,
  HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
} from './constants';

export function fetchFileContent(file) {
  return dispatch => {
    dispatch({
      type: HOME_FETCH_FILE_CONTENT_BEGIN,
    });

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/api/read-file', {
          params: { file },
        });
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_SUCCESS,
          data: { file, content: res.data.content },
        });
        resolve(res.data);
      } catch (e) {
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_FAILURE,
          data: { file, error: e },
        });
        reject(e);
      }
    });
    return promise;
  };
}

export function dismissFetchFileContentError() {
  return {
    type: HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_FILE_CONTENT_BEGIN:
      return {
        ...state,
        fetchFileContentPending: true,
        fetchFileContentError: null,
      };

    case HOME_FETCH_FILE_CONTENT_SUCCESS: {
      const fileContentNeedReload = { ...state.fileContentNeedReload };
      delete fileContentNeedReload[action.data.file];
      return {
        ...state,
        fileContentById: {
          ...state.fileContentById,
          [action.data.file]: action.data.content,
        },
        fileContentNeedReload,
        fetchFileContentPending: false,
        fetchFileContentError: null,
      };
    }

    case HOME_FETCH_FILE_CONTENT_FAILURE: {
      // if failed to fetch file content, don't reload it again to avoid infinite loop
      const fileContentNeedReload = { ...state.fileContentNeedReload };
      delete fileContentNeedReload[action.data.file];
      return {
        ...state,
        fileContentNeedReload,
        fetchFileContentPending: false,
        fetchFileContentError: action.data.error,
      };
    }

    case HOME_FETCH_FILE_CONTENT_DISMISS_ERROR:
      return {
        ...state,
        fetchFileContentError: null,
      };

    default:
      return state;
  }
}
