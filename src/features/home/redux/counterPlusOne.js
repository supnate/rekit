import {
  HOME_COUNTER_PLUS_ONE,
} from './constants';

export function counterPlusOne() {
  return {
    type: HOME_COUNTER_PLUS_ONE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
