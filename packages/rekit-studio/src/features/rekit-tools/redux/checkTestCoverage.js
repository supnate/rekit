import {
  REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR,
} from './constants';

export function checkTestCoverage(args) {
  return (dispatch) => {
    dispatch({
      type: REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismissCheckTestCoverageError() {
  return {
    type: REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN:
      return {
        ...state,
        checkTestCoveragePending: true,
        checkTestCoverageError: null,
      };

    case REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS:
      return {
        ...state,
        checkTestCoveragePending: false,
        checkTestCoverageError: null,
      };

    case REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE:
      return {
        ...state,
        checkTestCoveragePending: false,
        checkTestCoverageError: action.data.error,
      };

    case REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR:
      return {
        ...state,
        checkTestCoverageError: null,
      };

    default:
      return state;
  }
}
