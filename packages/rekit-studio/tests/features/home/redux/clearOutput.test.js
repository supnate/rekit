import {
  HOME_CLEAR_OUTPUT,
} from '../../../../src/features/home/redux/constants';

import {
  clearOutput,
  reducer,
} from '../../../../src/features/home/redux/clearOutput';

describe('home/redux/clearOutput', () => {
  it('returns correct action by clearOutput', () => {
    expect(clearOutput()).toHaveProperty('type', HOME_CLEAR_OUTPUT);
  });

  it('handles action type HOME_CLEAR_OUTPUT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_CLEAR_OUTPUT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
