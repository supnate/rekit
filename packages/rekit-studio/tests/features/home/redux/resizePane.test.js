import {
  HOME_RESIZE_PANE,
} from '../../../../src/features/home/redux/constants';

import {
  resizePane,
  reducer,
} from '../../../../src/features/home/redux/resizePane';

describe('home/redux/resizePane', () => {
  it('returns correct action by resizePane', () => {
    expect(resizePane()).toHaveProperty('type', HOME_RESIZE_PANE);
  });

  it('handles action type HOME_RESIZE_PANE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_RESIZE_PANE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
