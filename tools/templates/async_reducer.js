    /* ===== ${ACTION_NAME} ===== */
    case ${BEGIN_ACTION_TYPE}:
      return {
        ...state,
        ${CAMEL_ACTION_NAME}Pending: true,
        ${CAMEL_ACTION_NAME}Error: null,
      };

    case ${SUCCESS_ACTION_TYPE}:
      return {
        ...state,
        ${CAMEL_ACTION_NAME}Pending: false,
        ${CAMEL_ACTION_NAME}Error: null,
      };

    case ${FAILURE_ACTION_TYPE}:
      return {
        ...state,
        ${CAMEL_ACTION_NAME}Pending: false,
        ${CAMEL_ACTION_NAME}Error: action.data.error,
      };

    case ${DISMISS_ERROR_ACTION_TYPE}:
      return {
        ...state,
        ${CAMEL_ACTION_NAME}Error: null,
      };
