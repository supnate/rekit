import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  REKIT_TOOLS_RUN_TEST_BEGIN,
  REKIT_TOOLS_RUN_TEST_SUCCESS,
  REKIT_TOOLS_RUN_TEST_FAILURE,
  REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
} from 'src/features/rekit-tools/redux/constants';

import {
  runTest,
  dismissRunTestError,
  reducer,
} from 'src/features/rekit-tools/redux/runTest';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('rekit-tools/redux/runTest', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when runTest succeeds', () => {
    nock('http://localhost')
      .post('/rekit/api/run-test')
      .reply(200, { data: {} });
    const store = mockStore({});

    return store.dispatch(runTest('file.test.js'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', REKIT_TOOLS_RUN_TEST_BEGIN);
        expect(actions[1]).to.have.property('type', REKIT_TOOLS_RUN_TEST_SUCCESS);
      });
  });

  it('dispatches failure action when runTest fails', () => {
    nock('http://localhost')
      .post('/rekit/api/run-test')
      .reply(500, {});
    const store = mockStore({});

    return store.dispatch(runTest({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', REKIT_TOOLS_RUN_TEST_BEGIN);
        expect(actions[1]).to.have.property('type', REKIT_TOOLS_RUN_TEST_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error');
      });
  });

  it('returns correct action by dismissRunTestError', () => {
    const expectedAction = {
      type: REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
    };
    expect(dismissRunTestError()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_TOOLS_RUN_TEST_BEGIN correctly', () => {
    const prevState = { runTestPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_TEST_BEGIN, data: { testFile: 'file.test.js' } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runTestPending).to.be.true;
  });

  it('handles action type REKIT_TOOLS_RUN_TEST_SUCCESS correctly', () => {
    const prevState = { runTestPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_TEST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runTestPending).to.be.false;
  });

  it('handles action type REKIT_TOOLS_RUN_TEST_FAILURE correctly', () => {
    const prevState = { runTestPending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_TEST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runTestPending).to.be.false;
    expect(state.runTestError).to.exist;
  });

  it('handles action type REKIT_TOOLS_RUN_TEST_DISMISS_ERROR correctly', () => {
    const prevState = { runTestError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_RUN_TEST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runTestError).to.be.null;
  });
});
