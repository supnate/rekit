import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from './constants';

export function ${_.camelCase(action)}(args) {
  return (dispatch) => {
    dispatch({
      type: ${actionTypes.begin},
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: ${actionTypes.success},
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: ${actionTypes.failure},
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismiss${_.pascalCase(action)}Error() {
  return {
    type: ${actionTypes.dismissError},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ${actionTypes.begin}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: true,
        ${_.camelCase(action)}Error: null,
      };

    case ${actionTypes.success}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: false,
        ${_.camelCase(action)}Error: null,
      };

    case ${actionTypes.failure}:
      return {
        ...state,
        ${_.camelCase(action)}Pending: false,
        ${_.camelCase(action)}Error: action.data.error,
      };

    case ${actionTypes.dismissError}:
      return {
        ...state,
        ${_.camelCase(action)}Error: null,
      };

    default:
      return state;
  }
}
