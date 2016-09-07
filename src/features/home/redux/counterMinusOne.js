import {
  COUNTER_MINUS_ONE,
} from './constants';

export function counterMinusOne() {
  return {
    type: COUNTER_MINUS_ONE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
}
