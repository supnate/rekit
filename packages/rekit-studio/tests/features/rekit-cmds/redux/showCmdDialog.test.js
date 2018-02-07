import { expect } from 'chai';

import {
  REKIT_CMDS_SHOW_CMD_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  showCmdDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/showCmdDialog';

describe('rekit-cmds/redux/showCmdDialog', () => {
  it('returns correct action by showCmdDialog', () => {
    expect(showCmdDialog()).to.have.property('type', REKIT_CMDS_SHOW_CMD_DIALOG);
  });

  it('handles action type REKIT_CMDS_SHOW_CMD_DIALOG correctly', () => {
    const prevState = { cmdArgs: null, cmdDialogVisible: false };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_SHOW_CMD_DIALOG, data: { dialogType: 'cmd', cmdArgs: { commandName: 'add' } } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal({
      cmdDialogVisible: true,
      cmdArgs: {
        commandName: 'add',
      },
    });
  });
});
