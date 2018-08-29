import {
  HOME_SET_BOTTOM_DRAWER_VISIBLE,
} from '../../../../src/features/home/redux/constants';

import {
  setBottomDrawerVisible,
  reducer,
} from '../../../../src/features/home/redux/setBottomDrawerVisible';

describe('home/redux/setBottomDrawerVisible', () => {
  it('returns correct action by setBottomDrawerVisible', () => {
    expect(setBottomDrawerVisible()).toHaveProperty('type', HOME_SET_BOTTOM_DRAWER_VISIBLE);
  });

  it('handles action type HOME_SET_BOTTOM_DRAWER_VISIBLE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_BOTTOM_DRAWER_VISIBLE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
