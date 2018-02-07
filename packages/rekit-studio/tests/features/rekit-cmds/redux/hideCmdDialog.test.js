import { expect } from 'chai';

import {
  REKIT_CMDS_HIDE_CMD_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  hideCmdDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/hideCmdDialog';

describe('rekit-cmds/redux/hideCmdDialog', () => {
  it('returns correct action by hideCmdDialog', () => {
    expect(hideCmdDialog()).to.have.property('type', REKIT_CMDS_HIDE_CMD_DIALOG);
  });

  it('handles action type REKIT_CMDS_HIDE_CMD_DIALOG correctly', () => {
    const prevState = { cmdArgs: {}, cmdDialogVisible: true };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_HIDE_CMD_DIALOG, data: { dialogType: 'cmd' } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal({
      cmdArgs: null,
      cmdDialogVisible: false,
    });
  });
});
