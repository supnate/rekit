import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_FETCH_DEPS_BEGIN,
  CONFIG_FETCH_DEPS_SUCCESS,
  CONFIG_FETCH_DEPS_FAILURE,
  CONFIG_FETCH_DEPS_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  fetchDeps,
  dismissFetchDepsError,
  reducer,
} from 'src/features/config/redux/fetchDeps';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/fetchDeps', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchDeps succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchDeps())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_DEPS_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_DEPS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchDeps fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchDeps({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_FETCH_DEPS_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_FETCH_DEPS_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissFetchDepsError', () => {
    const expectedAction = {
      type: CONFIG_FETCH_DEPS_DISMISS_ERROR,
    };
    expect(dismissFetchDepsError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_FETCH_DEPS_BEGIN correctly', () => {
    const prevState = { fetchDepsPending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsPending).to.be.true;
  });

  it('handles action type CONFIG_FETCH_DEPS_SUCCESS correctly', () => {
    const prevState = { fetchDepsPending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsPending).to.be.false;
  });

  it('handles action type CONFIG_FETCH_DEPS_FAILURE correctly', () => {
    const prevState = { fetchDepsPending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsPending).to.be.false;
    expect(state.fetchDepsError).to.exist;
  });

  it('handles action type CONFIG_FETCH_DEPS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchDepsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_FETCH_DEPS_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchDepsError).to.be.null;
  });
});
