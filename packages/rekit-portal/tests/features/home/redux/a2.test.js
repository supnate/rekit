import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_A_2_BEGIN,
  HOME_A_2_SUCCESS,
  HOME_A_2_FAILURE,
  HOME_A_2_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  a2,
  dismissA2Error,
  reducer,
} from 'src/features/home/redux/a2';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/a2', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when a2 succeeds', () => {
    const store = mockStore({});

    return store.dispatch(a2())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_2_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_2_SUCCESS);
      });
  });

  it('dispatches failure action when a2 fails', () => {
    const store = mockStore({});

    return store.dispatch(a2({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_A_2_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_A_2_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissA2Error', () => {
    const expectedAction = {
      type: HOME_A_2_DISMISS_ERROR,
    };
    expect(dismissA2Error()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_A_2_BEGIN correctly', () => {
    const prevState = { a2Pending: false };
    const state = reducer(
      prevState,
      { type: HOME_A_2_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.true;
  });

  it('handles action type HOME_A_2_SUCCESS correctly', () => {
    const prevState = { a2Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_2_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.false;
  });

  it('handles action type HOME_A_2_FAILURE correctly', () => {
    const prevState = { a2Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_2_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.false;
    expect(state.a2Error).to.exist;
  });

  it('handles action type HOME_A_2_DISMISS_ERROR correctly', () => {
    const prevState = { a2Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_A_2_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Error).to.be.null;
  });
});
