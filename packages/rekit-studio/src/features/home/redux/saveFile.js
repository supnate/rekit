import axios from 'axios';
import {
  HOME_SAVE_FILE_BEGIN,
  HOME_SAVE_FILE_SUCCESS,
  HOME_SAVE_FILE_FAILURE,
  HOME_SAVE_FILE_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function saveFile(filePath, content) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_SAVE_FILE_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.post('/rekit/api/save-file', {
        file: filePath,
        content,
      });

      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_SAVE_FILE_SUCCESS,
            data: {
              file: filePath,
              content,
            },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_SAVE_FILE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissSaveFileError() {
  return {
    type: HOME_SAVE_FILE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SAVE_FILE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        saveFilePending: true,
        saveFileError: null,
      };

    case HOME_SAVE_FILE_SUCCESS: {
      // The request is success
      return {
        ...state,
        saveFilePending: false,
        saveFileError: null,

        fileContentById: {
          ...state.fileContentById,
          [action.data.file]: action.data.content,
        },
      };
    }

    case HOME_SAVE_FILE_FAILURE:
      // The request is failed
      return {
        ...state,
        saveFilePending: false,
        saveFileError: action.data.error,
      };

    case HOME_SAVE_FILE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        saveFileError: null,
      };

    default:
      return state;
  }
}
