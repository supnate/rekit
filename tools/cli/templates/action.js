import {
  ${ACTION_TYPE},
} from './constants';

export function ${CAMEL_ACTION_NAME}() {
  return {
    type: ${ACTION_TYPE},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ${ACTION_TYPE}:
      return {
        ...state,
      };

    default:
      return state;
  }
}
