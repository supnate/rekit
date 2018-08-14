import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CORE_HANDLE_CORE_COMMAND_BEGIN,
  CORE_HANDLE_CORE_COMMAND_SUCCESS,
  CORE_HANDLE_CORE_COMMAND_FAILURE,
  CORE_HANDLE_CORE_COMMAND_DISMISS_ERROR,
} from 'src/features/core/redux/constants';

import {
  handleCoreCommand,
  dismissHandleCoreCommandError,
  reducer,
} from 'src/features/core/redux/handleCoreCommand';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('core/redux/handleCoreCommand', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when handleCoreCommand succeeds', () => {
    const store = mockStore({});

    return store.dispatch(handleCoreCommand())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_HANDLE_CORE_COMMAND_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_HANDLE_CORE_COMMAND_SUCCESS);
      });
  });

  it('dispatches failure action when handleCoreCommand fails', () => {
    const store = mockStore({});

    return store.dispatch(handleCoreCommand({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_HANDLE_CORE_COMMAND_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_HANDLE_CORE_COMMAND_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissHandleCoreCommandError', () => {
    const expectedAction = {
      type: CORE_HANDLE_CORE_COMMAND_DISMISS_ERROR,
    };
    expect(dismissHandleCoreCommandError()).to.deep.equal(expectedAction);
  });

  it('handles action type CORE_HANDLE_CORE_COMMAND_BEGIN correctly', () => {
    const prevState = { handleCoreCommandPending: false };
    const state = reducer(
      prevState,
      { type: CORE_HANDLE_CORE_COMMAND_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.handleCoreCommandPending).to.be.true;
  });

  it('handles action type CORE_HANDLE_CORE_COMMAND_SUCCESS correctly', () => {
    const prevState = { handleCoreCommandPending: true };
    const state = reducer(
      prevState,
      { type: CORE_HANDLE_CORE_COMMAND_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.handleCoreCommandPending).to.be.false;
  });

  it('handles action type CORE_HANDLE_CORE_COMMAND_FAILURE correctly', () => {
    const prevState = { handleCoreCommandPending: true };
    const state = reducer(
      prevState,
      { type: CORE_HANDLE_CORE_COMMAND_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.handleCoreCommandPending).to.be.false;
    expect(state.handleCoreCommandError).to.exist;
  });

  it('handles action type CORE_HANDLE_CORE_COMMAND_DISMISS_ERROR correctly', () => {
    const prevState = { handleCoreCommandError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CORE_HANDLE_CORE_COMMAND_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.handleCoreCommandError).to.be.null;
  });
});
