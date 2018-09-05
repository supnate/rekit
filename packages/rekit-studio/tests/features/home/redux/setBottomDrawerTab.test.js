import {
  HOME_SET_BOTTOM_DRAWER_TAB,
} from '../../../../src/features/home/redux/constants';

import {
  setBottomDrawerTab,
  reducer,
} from '../../../../src/features/home/redux/setBottomDrawerTab';

describe('home/redux/setBottomDrawerTab', () => {
  it('returns correct action by setBottomDrawerTab', () => {
    expect(setBottomDrawerTab()).toHaveProperty('type', HOME_SET_BOTTOM_DRAWER_TAB);
  });

  it('handles action type HOME_SET_BOTTOM_DRAWER_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_BOTTOM_DRAWER_TAB }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
