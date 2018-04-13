import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONFIG_INSTALL_PACKAGE_BEGIN,
  CONFIG_INSTALL_PACKAGE_SUCCESS,
  CONFIG_INSTALL_PACKAGE_FAILURE,
  CONFIG_INSTALL_PACKAGE_DISMISS_ERROR,
} from 'src/features/config/redux/constants';

import {
  installPackage,
  dismissInstallPackageError,
  reducer,
} from 'src/features/config/redux/installPackage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('config/redux/installPackage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when installPackage succeeds', () => {
    const store = mockStore({});

    return store.dispatch(installPackage())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_INSTALL_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_INSTALL_PACKAGE_SUCCESS);
      });
  });

  it('dispatches failure action when installPackage fails', () => {
    const store = mockStore({});

    return store.dispatch(installPackage({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CONFIG_INSTALL_PACKAGE_BEGIN);
        expect(actions[1]).to.have.property('type', CONFIG_INSTALL_PACKAGE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissInstallPackageError', () => {
    const expectedAction = {
      type: CONFIG_INSTALL_PACKAGE_DISMISS_ERROR,
    };
    expect(dismissInstallPackageError()).to.deep.equal(expectedAction);
  });

  it('handles action type CONFIG_INSTALL_PACKAGE_BEGIN correctly', () => {
    const prevState = { installPackagePending: false };
    const state = reducer(
      prevState,
      { type: CONFIG_INSTALL_PACKAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.installPackagePending).to.be.true;
  });

  it('handles action type CONFIG_INSTALL_PACKAGE_SUCCESS correctly', () => {
    const prevState = { installPackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_INSTALL_PACKAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.installPackagePending).to.be.false;
  });

  it('handles action type CONFIG_INSTALL_PACKAGE_FAILURE correctly', () => {
    const prevState = { installPackagePending: true };
    const state = reducer(
      prevState,
      { type: CONFIG_INSTALL_PACKAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.installPackagePending).to.be.false;
    expect(state.installPackageError).to.exist;
  });

  it('handles action type CONFIG_INSTALL_PACKAGE_DISMISS_ERROR correctly', () => {
    const prevState = { installPackageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONFIG_INSTALL_PACKAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.installPackageError).to.be.null;
  });
});
