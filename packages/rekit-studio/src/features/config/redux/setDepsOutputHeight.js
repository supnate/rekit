// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { CONFIG_SET_DEPS_OUTPUT_HEIGHT } from './constants';

export function setDepsOutputHeight(height) {
  if (height < 50) height = 50;
  else if (height > 600) height = 600;
  return {
    type: CONFIG_SET_DEPS_OUTPUT_HEIGHT,
    data: { height },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CONFIG_SET_DEPS_OUTPUT_HEIGHT:
      return {
        ...state,
        depsOutputHeight: action.data.height,
      };

    default:
      return state;
  }
}
