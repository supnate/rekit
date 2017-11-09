import {
  REKIT_CMDS_HIDE_CMD_DIALOG,
} from './constants';

export function hideCmdDialog(dialogType) {
  return {
    type: REKIT_CMDS_HIDE_CMD_DIALOG,
    data: { dialogType },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_CMDS_HIDE_CMD_DIALOG:
      return {
        ...state,
        [`${action.data.dialogType}DialogVisible`]: false,
        cmdArgs: null,
      };

    default:
      return state;
  }
}
