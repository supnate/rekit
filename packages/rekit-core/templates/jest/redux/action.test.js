import {
  ${actionType},
} from '../../../../src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
  reducer,
} from '../../../../src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  it('returns correct action by ${_.camelCase(action)}', () => {
    expect(${_.camelCase(action)}()).toHaveProperty('type', ${actionType});
  });

  it('handles action type ${actionType} correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${actionType} }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state).toEqual({});
  });
});
