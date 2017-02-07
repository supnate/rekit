import {
  HOME_RESET_COUNTER,
} from './constants';

export function resetCounter() {
  return {
    type: HOME_RESET_COUNTER,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_RESET_COUNTER:
      return {
        ...state,
        count: 0,
      };

    default:
      return state;
  }
}
