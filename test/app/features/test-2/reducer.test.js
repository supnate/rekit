import { expect } from 'chai';
import reducer from 'features/test-2/reducer';
import {
  TEST_2_TEST_ACTION,
  MY_ASYNC_ACTION_BEGIN,
  MY_ASYNC_ACTION_SUCCESS,
  MY_ASYNC_ACTION_FAILURE,
  MY_ASYNC_ACTION_DISMISS_ERROR,
} from 'features/test-2/constants';

describe('features/test-2/reducer', () => {
  it('should have initial state', () => {
    const state = reducer(
      undefined,
      { type: '_unknown_action_' }
    );
    expect(state).to.exist;
  });

  it('should do nothing without matched action', () => {
    const prevState = { count: 0 };
    const state = reducer(
      prevState,
      { type: '_unknown_action_type_' }
    );
    expect(state).to.equal(prevState);
  });

  it('should handle TEST_2_TEST_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TEST_2_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });

  it('should handle MY_ASYNC_ACTION_BEGIN', () => {
    const prevState = { myAsyncActionPending: true };
    const state = reducer(
      prevState,
      { type: MY_ASYNC_ACTION_BEGIN }
    );
    expect(state).to.not.equal(prevState);
    expect(state.myAsyncActionPending).to.be.true;
  });

  it('should handle MY_ASYNC_ACTION_SUCCESS', () => {
    const prevState = { myAsyncActionPending: true };
    const state = reducer(
      prevState,
      { type: MY_ASYNC_ACTION_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.myAsyncActionPending).to.be.false;
  });

  it('should handle MY_ASYNC_ACTION_FAILURE', () => {
    const prevState = { myAsyncActionPending: true };
    const state = reducer(
      prevState,
      { type: MY_ASYNC_ACTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.myAsyncActionPending).to.be.false;
    expect(state.myAsyncActionError).to.exist;
  });

  it('should handle MY_ASYNC_ACTION_DISMISS_ERROR', () => {
    const prevState = { myAsyncActionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MY_ASYNC_ACTION_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState);
    expect(state.myAsyncActionError).to.be.null;
  });
});
