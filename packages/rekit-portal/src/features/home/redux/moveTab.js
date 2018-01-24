import {
  HOME_MOVE_TAB,
} from './constants';

export function moveTab() {
  return {
    type: HOME_MOVE_TAB,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_MOVE_TAB:
      return {
        ...state,
      };

    default:
      return state;
  }
}
