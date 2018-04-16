import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_UPDATE_PACKAGE_BEGIN,
  CONFIG_UPDATE_PACKAGE_SUCCESS,
  CONFIG_UPDATE_PACKAGE_FAILURE,
  CONFIG_UPDATE_PACKAGE_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  updatePackage,
  dismissUpdatePackageError,
  reducer,
} from 'src/features/config/redux/updatePackage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/updatePackage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updatePackage succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updatePackage())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_UPDATE_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_UPDATE_PACKAGE_SUCCESS);
      });
  });

  it('dispatches failure action when updatePackage fails', () => {
    const store = mockStore({});

    return store.dispatch(updatePackage({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_UPDATE_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_UPDATE_PACKAGE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissUpdatePackageError', () => {
    const expectedAction = {
      type: CONFIG_UPDATE_PACKAGE_DISMISS_ERROR,
    };
    expect(dismissUpdatePackageError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_UPDATE_PACKAGE_BEGIN correctly', () => {
    const prevState = { updatePackagePending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_UPDATE_PACKAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updatePackagePending).to.be.true;
  });

  it('handles action type CONFIG_UPDATE_PACKAGE_SUCCESS correctly', () => {
    const prevState = { updatePackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_UPDATE_PACKAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updatePackagePending).to.be.false;
  });

  it('handles action type CONFIG_UPDATE_PACKAGE_FAILURE correctly', () => {
    const prevState = { updatePackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_UPDATE_PACKAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updatePackagePending).to.be.false;
    expect(state.updatePackageError).to.exist;
  });

  it('handles action type CONFIG_UPDATE_PACKAGE_DISMISS_ERROR correctly', () => {
    const prevState = { updatePackageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_UPDATE_PACKAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updatePackageError).to.be.null;
  });
});
