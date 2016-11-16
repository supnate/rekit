import {
  ${_.upperSnakeCase(actionType)},
} from './constants';

export function ${_.camelCase(action)}() {
  return {
    type: ${_.upperSnakeCase(actionType)},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ${_.upperSnakeCase(actionType)}:
      return {
        ...state,
      };

    default:
      return state;
  }
}
