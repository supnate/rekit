import _ from 'lodash';
import axios from 'axios';
import {
  REKIT_TOOLS_RUN_TEST_BEGIN,
  REKIT_TOOLS_RUN_TEST_SUCCESS,
  REKIT_TOOLS_RUN_TEST_FAILURE,
  REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
} from './constants';

import { getTestFilePattern } from '../utils';

export function runTest(testFile) {
  return (dispatch) => {
    dispatch({
      type: REKIT_TOOLS_RUN_TEST_BEGIN,
      data: { testFile },
    });
    const promise = new Promise(async (resolve, reject) => {
      let res = null;
      try {
        res = await axios.post('/rekit/api/run-test', { testFile: getTestFilePattern(testFile) || '' });
      } catch (e) {
        dispatch({
          type: REKIT_TOOLS_RUN_TEST_FAILURE,
          data: { error: _.get(e, 'response.data') || e.message || e },
        });
        reject(e);
        return;
      }
      dispatch({
        type: REKIT_TOOLS_RUN_TEST_SUCCESS,
        data: { output: res.data },
      });
      resolve(res.data);
    });

    return promise;
  };
}

export function dismissRunTestError() {
  return {
    type: REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_RUN_TEST_BEGIN:
      return {
        ...state,
        currentTestFile: action.data.testFile,
        runTestOutput: null,
        runTestPending: true,
        runTestError: null,
      };

    case REKIT_TOOLS_RUN_TEST_SUCCESS:
      return {
        ...state,
        runTestPending: false,
        runTestError: null,
        runTestRunning: true,
      };

    case REKIT_TOOLS_RUN_TEST_FAILURE:
      return {
        ...state,
        runTestPending: false,

        runTestError: action.data.error,
      };

    case REKIT_TOOLS_RUN_TEST_DISMISS_ERROR:
      return {
        ...state,
        runTestError: null,
      };

    default:
      return state;
  }
}
