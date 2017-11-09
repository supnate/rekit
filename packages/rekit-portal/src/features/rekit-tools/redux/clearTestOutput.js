import {
  REKIT_TOOLS_CLEAR_TEST_OUTPUT,
} from './constants';

export function clearTestOutput() {
  return {
    type: REKIT_TOOLS_CLEAR_TEST_OUTPUT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_CLEAR_TEST_OUTPUT:
      return {
        ...state,
        currentTestFile: null,
        runTestOutput: [],
      };

    default:
      return state;
  }
}
