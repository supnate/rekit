import { expect } from 'chai';
import reducer from 'features/home/reducer';
import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
} from 'features/home/constants';

describe('home/reducer', () => {
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

  it(`should handle ${COUNTER_PLUS_ONE}`, () => {
    const state = reducer(
      { count: 0 },
      { type: COUNTER_PLUS_ONE }
    );
    expect(state.count).to.equal(1);
  });

  it(`should handle ${COUNTER_MINUS_ONE}`, () => {
    const state = reducer(
      { count: 6 },
      { type: COUNTER_MINUS_ONE }
    );
    expect(state.count).to.equal(5);
  });

  it(`should handle ${RESET_COUNTER}`, () => {
    const state = reducer(
      { count: 5 },
      { type: RESET_COUNTER }
    );
    expect(state.count).to.equal(0);
  });
});
