import {
  HOME_A_1,
} from './constants';

export function a1() {
  return {
    type: HOME_A_1,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_A_1:
      return {
        ...state,
      };

    default:
      return state;
  }
}
