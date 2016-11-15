import {
  TEST_3_TEST_ACTION,
} from './constants';

export function test3TestAction() {
  return {
    type: TEST_3_TEST_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TEST_3_TEST_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
