import { expect } from 'chai';
import reducer from 'features/test-2/reducer';
import {
  TEST_2_TEST_ACTION,
  AA_22,
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
    expect(state).to.deep.equal(prevState); // TODO: replace this line to real case.
  });

  it('should handle AA_22', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: AA_22 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
