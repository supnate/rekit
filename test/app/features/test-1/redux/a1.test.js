import { expect } from 'chai';

import {
  A_1,
} from 'features/test-1/redux/constants';

import {
  a1,
  reducer,
} from 'features/test-1/redux/a1';

describe('test-1/redux/a1', () => {
  it('action: a1', () => {
    const expectedAction = {
      type: A_1,
    };
    expect(a1()).to.deep.equal(expectedAction);
  });

  it('reducer should handle A_1', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: A_1 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
