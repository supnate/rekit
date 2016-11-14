import {
  TEST_2_TEST_ACTION,
} from './constants';

export function test2TestAction() {
  return {
    type: TEST_2_TEST_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TEST_2_TEST_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
