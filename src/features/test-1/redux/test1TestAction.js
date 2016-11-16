import {
  TEST_1_TEST_ACTION,
} from './constants';

export function test1TestAction() {
  return {
    type: TEST_1_TEST_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TEST_1_TEST_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
