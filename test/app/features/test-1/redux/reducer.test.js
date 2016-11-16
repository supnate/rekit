import { expect } from 'chai';
import reducer from 'features/test-1/redux/reducer';

describe('feature/test-1/redux/reducer', () => {
  it('feature test-1 reducer should do nothing if no matched action', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: '__unknown_action_type__' }
    );
    expect(state).to.equal(prevState);
  });

  // TODO: add global reducer test if needed.
});
