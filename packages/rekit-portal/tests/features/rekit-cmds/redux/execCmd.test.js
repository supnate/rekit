import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  REKIT_CMDS_EXEC_CMD_BEGIN,
  REKIT_CMDS_EXEC_CMD_SUCCESS,
  REKIT_CMDS_EXEC_CMD_FAILURE,
  REKIT_CMDS_EXEC_CMD_DISMISS_ERROR,
} from 'src/features/rekit-cmds/redux/constants';

import {
  execCmd,
  dismissExecCmdError,
  reducer,
} from 'src/features/rekit-cmds/redux/execCmd';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('rekit-cmds/redux/execCmd', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when execCmd succeeds', () => {
    nock('http://localhost')
      .post('/rekit/api/exec-cmd')
      .reply(200, { args: { commandName: 'add', type: 'component' }, logs: [] });
    const store = mockStore({});

    return store.dispatch(execCmd({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', REKIT_CMDS_EXEC_CMD_BEGIN);
        expect(actions[1]).to.have.property('type', REKIT_CMDS_EXEC_CMD_SUCCESS);
      });
  });

  it('dispatches failure action when execCmd fails', () => {
    nock('http://localhost')
      .post('/rekit/api/exec-cmd')
      .reply(500, {});
    const store = mockStore({});

    return store.dispatch(execCmd({}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', REKIT_CMDS_EXEC_CMD_BEGIN);
        expect(actions[1]).to.have.property('type', REKIT_CMDS_EXEC_CMD_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error');
      });
  });

  it('returns correct action by dismissExecCmdError', () => {
    const expectedAction = {
      type: REKIT_CMDS_EXEC_CMD_DISMISS_ERROR,
    };
    expect(dismissExecCmdError()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_CMDS_EXEC_CMD_BEGIN correctly', () => {
    const prevState = { execCmdPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_EXEC_CMD_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCmdPending).to.be.true;
  });

  it('handles action type REKIT_CMDS_EXEC_CMD_SUCCESS correctly', () => {
    const prevState = { execCmdPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_EXEC_CMD_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCmdPending).to.be.false;
  });

  it('handles action type REKIT_CMDS_EXEC_CMD_FAILURE correctly', () => {
    const prevState = { execCmdPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_EXEC_CMD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCmdPending).to.be.false;
    expect(state.execCmdError).to.exist;
  });

  it('handles action type REKIT_CMDS_EXEC_CMD_DISMISS_ERROR correctly', () => {
    const prevState = { execCmdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_EXEC_CMD_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCmdError).to.be.null;
  });
});
