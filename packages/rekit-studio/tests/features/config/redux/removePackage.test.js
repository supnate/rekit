import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_REMOVE_PACKAGE_BEGIN,
  CONFIG_REMOVE_PACKAGE_SUCCESS,
  CONFIG_REMOVE_PACKAGE_FAILURE,
  CONFIG_REMOVE_PACKAGE_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  removePackage,
  dismissRemovePackageError,
  reducer,
} from 'src/features/config/redux/removePackage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/removePackage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when removePackage succeeds', () => {
    const store = mockStore({});

    return store.dispatch(removePackage())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_REMOVE_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_REMOVE_PACKAGE_SUCCESS);
      });
  });

  it('dispatches failure action when removePackage fails', () => {
    const store = mockStore({});

    return store.dispatch(removePackage({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_REMOVE_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_REMOVE_PACKAGE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissRemovePackageError', () => {
    const expectedAction = {
      type: CONFIG_REMOVE_PACKAGE_DISMISS_ERROR,
    };
    expect(dismissRemovePackageError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_REMOVE_PACKAGE_BEGIN correctly', () => {
    const prevState = { removePackagePending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_REMOVE_PACKAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removePackagePending).to.be.true;
  });

  it('handles action type CONFIG_REMOVE_PACKAGE_SUCCESS correctly', () => {
    const prevState = { removePackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_REMOVE_PACKAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removePackagePending).to.be.false;
  });

  it('handles action type CONFIG_REMOVE_PACKAGE_FAILURE correctly', () => {
    const prevState = { removePackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_REMOVE_PACKAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removePackagePending).to.be.false;
    expect(state.removePackageError).to.exist;
  });

  it('handles action type CONFIG_REMOVE_PACKAGE_DISMISS_ERROR correctly', () => {
    const prevState = { removePackageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_REMOVE_PACKAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removePackageError).to.be.null;
  });
});
