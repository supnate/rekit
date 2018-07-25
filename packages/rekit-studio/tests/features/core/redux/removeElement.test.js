import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CORE_REMOVE_ELEMENT_BEGIN,
  CORE_REMOVE_ELEMENT_SUCCESS,
  CORE_REMOVE_ELEMENT_FAILURE,
  CORE_REMOVE_ELEMENT_DISMISS_ERROR,
} from 'src/features/core/redux/constants';

import {
  removeElement,
  dismissRemoveElementError,
  reducer,
} from 'src/features/core/redux/removeElement';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('core/redux/removeElement', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when removeElement succeeds', () => {
    const store = mockStore({});

    return store.dispatch(removeElement())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_REMOVE_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_REMOVE_ELEMENT_SUCCESS);
      });
  });

  it('dispatches failure action when removeElement fails', () => {
    const store = mockStore({});

    return store.dispatch(removeElement({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_REMOVE_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_REMOVE_ELEMENT_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissRemoveElementError', () => {
    const expectedAction = {
      type: CORE_REMOVE_ELEMENT_DISMISS_ERROR,
    };
    expect(dismissRemoveElementError()).to.deep.equal(expectedAction);
  });

  it('handles action type CORE_UI_REMOVE_ELEMENT_BEGIN correctly', () => {
    const prevState = { removeElementPending: false };
    const state = reducer(
      prevState,
      { type: CORE_REMOVE_ELEMENT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeElementPending).to.be.true;
  });

  it('handles action type CORE_UI_REMOVE_ELEMENT_SUCCESS correctly', () => {
    const prevState = { removeElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_REMOVE_ELEMENT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeElementPending).to.be.false;
  });

  it('handles action type CORE_UI_REMOVE_ELEMENT_FAILURE correctly', () => {
    const prevState = { removeElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_REMOVE_ELEMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeElementPending).to.be.false;
    expect(state.removeElementError).to.exist;
  });

  it('handles action type CORE_UI_REMOVE_ELEMENT_DISMISS_ERROR correctly', () => {
    const prevState = { removeElementError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CORE_REMOVE_ELEMENT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeElementError).to.be.null;
  });
});
