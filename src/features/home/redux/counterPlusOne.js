import {
  COUNTER_PLUS_ONE,
} from './constants';

export function counterPlusOne() {
  return {
    type: COUNTER_PLUS_ONE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
