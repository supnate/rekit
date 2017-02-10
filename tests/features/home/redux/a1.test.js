import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_A_1_BEGIN,
  HOME_A_1_SUCCESS,
  HOME_A_1_FAILURE,
  HOME_A_1_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  a1,
  dismissA1Error,
  reducer,
} from 'src/features/home/redux/a1';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/a1', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when a1 succeeds', () => {
    const store = mockStore({});

    return store.dispatch(a1())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_1_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_1_SUCCESS);
      });
  });

  it('dispatches failure action when a1 fails', () => {
    const store = mockStore({});

    return store.dispatch(a1({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_1_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_1_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissA1Error', () => {
    const expectedAction = {
      type: HOME_A_1_DISMISS_ERROR,
    };
    expect(dismissA1Error()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_A_1_BEGIN correctly', () => {
    const prevState = { a1Pending: false };
    const state = reducer(
      prevState,
      { type: HOME_A_1_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a1Pending).to.be.true;
  });

  it('handles action type HOME_A_1_SUCCESS correctly', () => {
    const prevState = { a1Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_1_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a1Pending).to.be.false;
  });

  it('handles action type HOME_A_1_FAILURE correctly', () => {
    const prevState = { a1Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_1_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a1Pending).to.be.false;
    expect(state.a1Error).to.exist;
  });

  it('handles action type HOME_A_1_DISMISS_ERROR correctly', () => {
    const prevState = { a1Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_A_1_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a1Error).to.be.null;
  });
});
