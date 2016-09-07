import {
  RESET_COUNTER,
} from './constants';

export function resetCounter() {
  return {
    type: RESET_COUNTER,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case RESET_COUNTER:
      return {
        ...state,
        count: 0,
      };

    default:
      return state;
  }
}
