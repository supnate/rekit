import { expect } from 'chai';

import {
  COMMON_A_1,
} from 'src/features/common/redux/constants';

import {
  a1,
  reducer,
} from 'src/features/common/redux/a1';

describe('common/redux/a1', () => {
  it('returns correct action by a1', () => {
    const expectedAction = {
      type: COMMON_A_1,
    };
    expect(a1()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_A_1 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_A_1 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
