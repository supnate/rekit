/* ===== ${ACTION_NAME} ===== */
export function ${CAMEL_ACTION_NAME}(args) {
  return dispatch => {
    dispatch({
      type: ${BEGIN_ACTION_TYPE},
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: ${SUCCESS_ACTION_TYPE},
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: ${FAILURE_ACTION_TYPE},
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

export function dismiss${ACTION_NAME}Error() {
  return {
    type: ${DISMISS_ERROR_ACTION_TYPE},
  };
}