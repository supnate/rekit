import {
  REKIT_CMDS_SHOW_CMD_DIALOG,
} from './constants';

export function showCmdDialog(dialogType, cmdArgs) {
  return {
    type: REKIT_CMDS_SHOW_CMD_DIALOG,
    data: { dialogType, cmdArgs },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_CMDS_SHOW_CMD_DIALOG:
      return {
        ...state,
        [`${action.data.dialogType}DialogVisible`]: true,
        cmdArgs: action.data.cmdArgs,
      };

    default:
      return state;
  }
}
