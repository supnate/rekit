import axios from 'axios';
import {
  HOME_FETCH_FILE_CONTENT_BEGIN,
  HOME_FETCH_FILE_CONTENT_SUCCESS,
  HOME_FETCH_FILE_CONTENT_FAILURE,
  HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
} from './constants';

export function fetchFileContent(file) {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_FILE_CONTENT_BEGIN,
    });

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/rekit/api/file-content', {
          params: { file }
        });
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_SUCCESS,
          data: { file, content: res.data.content },
        });
        resolve(res.data);
      } catch (e) {
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_FAILURE,
          data: { error: e },
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

    case HOME_FETCH_FILE_CONTENT_SUCCESS:
      return {
        ...state,
        fileContentById: {
          ...state.fileContentById,
          [action.data.file]: action.data.content,
        },
        fetchFileContentPending: false,
        fetchFileContentError: null,
      };

    case HOME_FETCH_FILE_CONTENT_FAILURE:
      return {
        ...state,
        fetchFileContentPending: false,
        fetchFileContentError: action.data.error,
      };

    case HOME_FETCH_FILE_CONTENT_DISMISS_ERROR:
      return {
        ...state,
        fetchFileContentError: null,
      };

    default:
      return state;
  }
}
