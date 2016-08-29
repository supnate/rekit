/* ===== ${ACTION_NAME} ===== */
export function ${CAMEL_ACTION_NAME}() {
  return dispatch => {
    dispatch({
      type: ${BEGIN_ACTION_TYPE},
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        dispatch({
          type: ${SUCCESS_ACTION_TYPE},
          data: {},
        });
        resolve();
        /* Un-comment below for error handling */
        // dispatch({
        //   type: ${FAILURE_ACTION_TYPE},
        //   data: {
        //     error: 'some error',
        //   },
        // });
        // reject();
      }, 1500);
    });

    return promise;
  };
}

export function dismiss${ACTION_NAME}Error() {
  return {
    type: ${DISMISS_ERROR_ACTION_TYPE},
  };
}