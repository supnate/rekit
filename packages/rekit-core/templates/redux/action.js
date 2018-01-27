import {
  ${actionType},
} from './constants';

export function ${_.camelCase(action)}() {
  return {
    type: ${actionType},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ${actionType}:
      return {
        ...state,
      };

    default:
      return state;
  }
}
