import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_REDDIT_BY_SAGA_BEGIN,
  HOME_FETCH_REDDIT_BY_SAGA_SUCCESS,
  HOME_FETCH_REDDIT_BY_SAGA_FAILURE,
  HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchRedditBySaga,
  dismissFetchRedditBySagaError,
  reducer,
} from 'src/features/home/redux/fetchRedditBySaga';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchRedditBySaga', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRedditBySaga succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_REDDIT_BY_SAGA_BEGIN },
      { type: HOME_FETCH_REDDIT_BY_SAGA_SUCCESS, data: {} },
    ];

    return store.dispatch(fetchRedditBySaga({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when fetchRedditBySaga fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_REDDIT_BY_SAGA_BEGIN },
      { type: HOME_FETCH_REDDIT_BY_SAGA_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(fetchRedditBySaga({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissFetchRedditBySagaError', () => {
    const expectedAction = {
      type: HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR,
    };
    expect(dismissFetchRedditBySagaError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_FETCH_REDDIT_BY_SAGA_BEGIN correctly', () => {
    const prevState = { fetchRedditBySagaPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_BY_SAGA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditBySagaPending).to.be.true;
  });

  it('handles action type HOME_FETCH_REDDIT_BY_SAGA_SUCCESS correctly', () => {
    const prevState = { fetchRedditBySagaPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_BY_SAGA_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditBySagaPending).to.be.false;
  });

  it('handles action type HOME_FETCH_REDDIT_BY_SAGA_FAILURE correctly', () => {
    const prevState = { fetchRedditBySagaPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_BY_SAGA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditBySagaPending).to.be.false;
    expect(state.fetchRedditBySagaError).to.exist;
  });

  it('handles action type HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRedditBySagaError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_BY_SAGA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditBySagaError).to.be.null;
  });
});
