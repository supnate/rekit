import { expect } from 'chai';
import reducer from 'features/test-1/reducer';
import {
  TEST_1_TEST_ACTION,
} from 'features/test-1/constants';

describe('features/test-1/reducer', () => {
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

  it('should handle TEST_1_TEST_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TEST_1_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
