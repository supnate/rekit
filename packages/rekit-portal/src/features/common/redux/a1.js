import {
  COMMON_A_1,
} from './constants';

export function a1() {
  return {
    type: COMMON_A_1,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_A_1:
      return {
        ...state,
      };

    default:
      return state;
  }
}
