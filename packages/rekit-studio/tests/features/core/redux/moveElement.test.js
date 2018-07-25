import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CORE_MOVE_ELEMENT_BEGIN,
  CORE_MOVE_ELEMENT_SUCCESS,
  CORE_MOVE_ELEMENT_FAILURE,
  CORE_MOVE_ELEMENT_DISMISS_ERROR,
} from 'src/features/core/redux/constants';

import {
  moveElement,
  dismissMoveElementError,
  reducer,
} from 'src/features/core/redux/moveElement';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('core/redux/moveElement', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when moveElement succeeds', () => {
    const store = mockStore({});

    return store.dispatch(moveElement())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_MOVE_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_MOVE_ELEMENT_SUCCESS);
      });
  });

  it('dispatches failure action when moveElement fails', () => {
    const store = mockStore({});

    return store.dispatch(moveElement({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CORE_MOVE_ELEMENT_BEGIN);
        expect(actions[1]).to.have.property('type', CORE_MOVE_ELEMENT_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissMoveElementError', () => {
    const expectedAction = {
      type: CORE_MOVE_ELEMENT_DISMISS_ERROR,
    };
    expect(dismissMoveElementError()).to.deep.equal(expectedAction);
  });

  it('handles action type CORE_UI_MOVE_ELEMENT_BEGIN correctly', () => {
    const prevState = { moveElementPending: false };
    const state = reducer(
      prevState,
      { type: CORE_MOVE_ELEMENT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.moveElementPending).to.be.true;
  });

  it('handles action type CORE_UI_MOVE_ELEMENT_SUCCESS correctly', () => {
    const prevState = { moveElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_MOVE_ELEMENT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.moveElementPending).to.be.false;
  });

  it('handles action type CORE_UI_MOVE_ELEMENT_FAILURE correctly', () => {
    const prevState = { moveElementPending: true };
    const state = reducer(
      prevState,
      { type: CORE_MOVE_ELEMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.moveElementPending).to.be.false;
    expect(state.moveElementError).to.exist;
  });

  it('handles action type CORE_UI_MOVE_ELEMENT_DISMISS_ERROR correctly', () => {
    const prevState = { moveElementError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CORE_MOVE_ELEMENT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.moveElementError).to.be.null;
  });
});
