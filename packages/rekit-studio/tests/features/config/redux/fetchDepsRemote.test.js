import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_FETCH_DEPS_REMOTE_BEGIN,
  CONFIG_FETCH_DEPS_REMOTE_SUCCESS,
  CONFIG_FETCH_DEPS_REMOTE_FAILURE,
  CONFIG_FETCH_DEPS_REMOTE_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  fetchDepsRemote,
  dismissFetchDepsRemoteError,
  reducer,
} from 'src/features/config/redux/fetchDepsRemote';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/fetchDepsRemote', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchDepsRemote succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchDepsRemote())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_DEPS_REMOTE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_DEPS_REMOTE_SUCCESS);
      });
  });

  it('dispatches failure action when fetchDepsRemote fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchDepsRemote({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_DEPS_REMOTE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_DEPS_REMOTE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissFetchDepsRemoteError', () => {
    const expectedAction = {
      type: CONFIG_FETCH_DEPS_REMOTE_DISMISS_ERROR,
    };
    expect(dismissFetchDepsRemoteError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_FETCH_DEPS_REMOTE_BEGIN correctly', () => {
    const prevState = { fetchDepsLatestVersionPending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_REMOTE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsLatestVersionPending).to.be.true;
  });

  it('handles action type CONFIG_FETCH_DEPS_REMOTE_SUCCESS correctly', () => {
    const prevState = { fetchDepsLatestVersionPending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_REMOTE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsLatestVersionPending).to.be.false;
  });

  it('handles action type CONFIG_FETCH_DEPS_REMOTE_FAILURE correctly', () => {
    const prevState = { fetchDepsLatestVersionPending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_REMOTE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsLatestVersionPending).to.be.false;
    expect(state.fetchDepsLatestVersionError).to.exist;
  });

  it('handles action type CONFIG_FETCH_DEPS_REMOTE_DISMISS_ERROR correctly', () => {
    const prevState = { fetchDepsLatestVersionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_REMOTE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsLatestVersionError).to.be.null;
  });
});
