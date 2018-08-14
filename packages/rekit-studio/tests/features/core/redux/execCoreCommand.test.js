import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CORE_EXEC_CORE_COMMAND_BEGIN,
  CORE_EXEC_CORE_COMMAND_SUCCESS,
  CORE_EXEC_CORE_COMMAND_FAILURE,
  CORE_EXEC_CORE_COMMAND_DISMISS_ERROR,
} from 'src/features/core/redux/constants';

import {
  execCoreCommand,
  dismissExecCoreCommandError,
  reducer,
} from 'src/features/core/redux/execCoreCommand';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('core/redux/execCoreCommand', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when execCoreCommand succeeds', () => {
    const store = mockStore({});

    return store.dispatch(execCoreCommand())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_EXEC_CORE_COMMAND_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_EXEC_CORE_COMMAND_SUCCESS);
      });
  });

  it('dispatches failure action when execCoreCommand fails', () => {
    const store = mockStore({});

    return store.dispatch(execCoreCommand({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_EXEC_CORE_COMMAND_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_EXEC_CORE_COMMAND_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissExecCoreCommandError', () => {
    const expectedAction = {
      type: CORE_EXEC_CORE_COMMAND_DISMISS_ERROR,
    };
    expect(dismissExecCoreCommandError()).to.deep.equal(expectedAction);
  });

  it('handles action type CORE_EXEC_CORE_COMMAND_BEGIN correctly', () => {
    const prevState = { execCoreCommandPending: false };
    const state = reducer(
      prevState,
      { type: CORE_EXEC_CORE_COMMAND_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCoreCommandPending).to.be.true;
  });

  it('handles action type CORE_EXEC_CORE_COMMAND_SUCCESS correctly', () => {
    const prevState = { execCoreCommandPending: true };
    const state = reducer(
      prevState,
      { type: CORE_EXEC_CORE_COMMAND_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCoreCommandPending).to.be.false;
  });

  it('handles action type CORE_EXEC_CORE_COMMAND_FAILURE correctly', () => {
    const prevState = { execCoreCommandPending: true };
    const state = reducer(
      prevState,
      { type: CORE_EXEC_CORE_COMMAND_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCoreCommandPending).to.be.false;
    expect(state.execCoreCommandError).to.exist;
  });

  it('handles action type CORE_EXEC_CORE_COMMAND_DISMISS_ERROR correctly', () => {
    const prevState = { execCoreCommandError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CORE_EXEC_CORE_COMMAND_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.execCoreCommandError).to.be.null;
  });
});
