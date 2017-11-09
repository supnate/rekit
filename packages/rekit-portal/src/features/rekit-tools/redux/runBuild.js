import _ from 'lodash';
import axios from 'axios';
import {
  REKIT_TOOLS_RUN_BUILD_BEGIN,
  REKIT_TOOLS_RUN_BUILD_SUCCESS,
  REKIT_TOOLS_RUN_BUILD_FAILURE,
  REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
} from './constants';

export function runBuild() {
  return (dispatch) => {
    dispatch({
      type: REKIT_TOOLS_RUN_BUILD_BEGIN,
    });
    const promise = new Promise(async (resolve, reject) => {
      let res = null;
      try {
        res = await axios.post('/rekit/api/run-build');
      } catch (e) {
        dispatch({
          type: REKIT_TOOLS_RUN_BUILD_FAILURE,
          data: { error: _.get(e, 'response.data') || e.message || e },
        });
        reject(e);
        return;
      }
      dispatch({
        type: REKIT_TOOLS_RUN_BUILD_SUCCESS,
        data: { output: res.data },
      });
      resolve(res.data);
    });

    return promise;
  };
}

export function dismissRunBuildError() {
  return {
    type: REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_RUN_BUILD_BEGIN:
      return {
        ...state,
        runBuildOutput: null,
        runBuildPending: true,
        runBuildError: null,
      };

    case REKIT_TOOLS_RUN_BUILD_SUCCESS:
      return {
        ...state,
        runBuildPending: false,
        runBuildError: null,
        runBuildRunning: true,
      };

    case REKIT_TOOLS_RUN_BUILD_FAILURE:
      return {
        ...state,
        runBuildPending: false,
        runBuildError: action.data.error,
      };

    case REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR:
      return {
        ...state,
        runBuildError: null,
      };

    default:
      return state;
  }
}
