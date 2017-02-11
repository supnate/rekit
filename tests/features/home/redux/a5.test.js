import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_A_5_BEGIN,
  HOME_A_5_SUCCESS,
  HOME_A_5_FAILURE,
  HOME_A_5_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  a5,
  dismissA5Error,
  reducer,
} from 'src/features/home/redux/a5';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/a5', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when a5 succeeds', () => {
    const store = mockStore({});

    return store.dispatch(a5())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_5_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_5_SUCCESS);
      });
  });

  it('dispatches failure action when a5 fails', () => {
    const store = mockStore({});

    return store.dispatch(a5({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_5_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_5_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissA5Error', () => {
    const expectedAction = {
      type: HOME_A_5_DISMISS_ERROR,
    };
    expect(dismissA5Error()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_A_5_BEGIN correctly', () => {
    const prevState = { a5Pending: false };
    const state = reducer(
      prevState,
      { type: HOME_A_5_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a5Pending).to.be.true;
  });

  it('handles action type HOME_A_5_SUCCESS correctly', () => {
    const prevState = { a5Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_5_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a5Pending).to.be.false;
  });

  it('handles action type HOME_A_5_FAILURE correctly', () => {
    const prevState = { a5Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_5_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a5Pending).to.be.false;
    expect(state.a5Error).to.exist;
  });

  it('handles action type HOME_A_5_DISMISS_ERROR correctly', () => {
    const prevState = { a5Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_A_5_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a5Error).to.be.null;
  });
});
