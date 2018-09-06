import {
  LAYOUT_C_2,
} from '../../../../src/features/layout/redux/constants';

import {
  c2,
  reducer,
} from '../../../../src/features/layout/redux/c2';

describe('layout/redux/c2', () => {
  it('returns correct action by c2', () => {
    expect(c2()).toHaveProperty('type', LAYOUT_C_2);
  });

  it('handles action type LAYOUT_C_2 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: LAYOUT_C_2 }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
