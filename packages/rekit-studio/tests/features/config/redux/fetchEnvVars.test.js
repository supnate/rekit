import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_FETCH_ENV_VARS_BEGIN,
  CONFIG_FETCH_ENV_VARS_SUCCESS,
  CONFIG_FETCH_ENV_VARS_FAILURE,
  CONFIG_FETCH_ENV_VARS_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  fetchEnvVars,
  dismissFetchEnvVarsError,
  reducer,
} from 'src/features/config/redux/fetchEnvVars';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/fetchEnvVars', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchEnvVars succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchEnvVars())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_ENV_VARS_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_ENV_VARS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchEnvVars fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchEnvVars({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_ENV_VARS_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_ENV_VARS_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissFetchEnvVarsError', () => {
    const expectedAction = {
      type: CONFIG_FETCH_ENV_VARS_DISMISS_ERROR,
    };
    expect(dismissFetchEnvVarsError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_FETCH_ENV_VARS_BEGIN correctly', () => {
    const prevState = { fetchEnvRemotePending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_ENV_VARS_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchEnvRemotePending).to.be.true;
  });

  it('handles action type CONFIG_FETCH_ENV_VARS_SUCCESS correctly', () => {
    const prevState = { fetchEnvRemotePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_ENV_VARS_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchEnvRemotePending).to.be.false;
  });

  it('handles action type CONFIG_FETCH_ENV_VARS_FAILURE correctly', () => {
    const prevState = { fetchEnvRemotePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_ENV_VARS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchEnvRemotePending).to.be.false;
    expect(state.fetchEnvRemoteError).to.exist;
  });

  it('handles action type CONFIG_FETCH_ENV_VARS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchEnvRemoteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_ENV_VARS_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchEnvRemoteError).to.be.null;
  });
});
