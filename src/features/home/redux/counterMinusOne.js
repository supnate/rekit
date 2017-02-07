import {
  HOME_COUNTER_MINUS_ONE,
} from './constants';

export function counterMinusOne() {
  return {
    type: HOME_COUNTER_MINUS_ONE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
}
