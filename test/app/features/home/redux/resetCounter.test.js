import { expect } from 'chai';

import {
  RESET_COUNTER,
} from 'features/home/redux/constants';

import {
  resetCounter,
  reducer,
} from 'features/home/redux/resetCounter';

describe('home/redux/resetCounter', () => {
  it('action: resetCounter', () => {
    const expectedAction = {
      type: RESET_COUNTER,
    };
    expect(resetCounter()).to.deep.equal(expectedAction);
  });

  it('reducer should handle RESET_COUNTER', () => {
    const prevState = { count: 10 };
    const state = reducer(
      prevState,
      { type: RESET_COUNTER }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(0);
  });
});
