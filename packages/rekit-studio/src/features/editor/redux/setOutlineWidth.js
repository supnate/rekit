import { storage } from '../../common/utils';

import { EDITOR_SET_OUTLINE_WIDTH } from './constants';

export function setOutlineWidth(width) {
  if (width < 50) width = 50;
  if (width > 500) width = 500;
  storage.local.setItem('outlineWidth', width);
  return {
    type: EDITOR_SET_OUTLINE_WIDTH,
    data: { width },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case EDITOR_SET_OUTLINE_WIDTH:
      return {
        ...state,
        outlineWidth: action.data.width,
      };

    default:
      return state;
  }
}
