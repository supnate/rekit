import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE,
  REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR,
} from 'src/features/rekit-tools/redux/constants';

import {
  checkTestCoverage,
  dismissCheckTestCoverageError,
  reducer,
} from 'src/features/rekit-tools/redux/checkTestCoverage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('rekit-tools/redux/checkTestCoverage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when checkTestCoverage succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN },
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS, data: {} },
    ];

    return store.dispatch(checkTestCoverage({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when checkTestCoverage fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN },
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(checkTestCoverage({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissCheckTestCoverageError', () => {
    const expectedAction = {
      type: REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR,
    };
    expect(dismissCheckTestCoverageError()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN correctly', () => {
    const prevState = { checkTestCoveragePending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.checkTestCoveragePending).to.be.true;
  });

  it('handles action type REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS correctly', () => {
    const prevState = { checkTestCoveragePending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.checkTestCoveragePending).to.be.false;
  });

  it('handles action type REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE correctly', () => {
    const prevState = { checkTestCoveragePending: true };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.checkTestCoveragePending).to.be.false;
    expect(state.checkTestCoverageError).to.exist;
  });

  it('handles action type REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR correctly', () => {
    const prevState = { checkTestCoverageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_CHECK_TEST_COVERAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.checkTestCoverageError).to.be.null;
  });
});
