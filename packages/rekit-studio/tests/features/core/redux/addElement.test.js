import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CORE_ADD_ELEMENT_BEGIN,
  CORE_ADD_ELEMENT_SUCCESS,
  CORE_ADD_ELEMENT_FAILURE,
  CORE_ADD_ELEMENT_DISMISS_ERROR,
} from 'src/features/core/redux/constants';

import {
  addElement,
  dismissAddElementError,
  reducer,
} from 'src/features/core/redux/addElement';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('core/redux/addElement', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addElement succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addElement())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_ADD_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_ADD_ELEMENT_SUCCESS);
      });
  });

  it('dispatches failure action when addElement fails', () => {
    const store = mockStore({});

    return store.dispatch(addElement({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_ADD_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_ADD_ELEMENT_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissAddElementError', () => {
    const expectedAction = {
      type: CORE_ADD_ELEMENT_DISMISS_ERROR,
    };
    expect(dismissAddElementError()).to.deep.equal(expectedAction);
  });

  it('handles action type CORE_UI_ADD_ELEMENT_BEGIN correctly', () => {
    const prevState = { addElementPending: false };
    const state = reducer(
      prevState,
      { type: CORE_ADD_ELEMENT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addElementPending).to.be.true;
  });

  it('handles action type CORE_UI_ADD_ELEMENT_SUCCESS correctly', () => {
    const prevState = { addElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_ADD_ELEMENT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addElementPending).to.be.false;
  });

  it('handles action type CORE_UI_ADD_ELEMENT_FAILURE correctly', () => {
    const prevState = { addElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_ADD_ELEMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addElementPending).to.be.false;
    expect(state.addElementError).to.exist;
  });

  it('handles action type CORE_UI_ADD_ELEMENT_DISMISS_ERROR correctly', () => {
    const prevState = { addElementError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CORE_ADD_ELEMENT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addElementError).to.be.null;
  });
});
