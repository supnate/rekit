import { expect } from 'chai';

import {
  COUNTER_MINUS_ONE,
} from 'features/home/redux/constants';

import {
  counterMinusOne,
  reducer,
} from 'features/home/redux/counterMinusOne';

describe('home/redux/counterMinusOne', () => {
  it('action: counterMinusOne', () => {
    const expectedAction = {
      type: COUNTER_MINUS_ONE,
    };
    expect(counterMinusOne()).to.deep.equal(expectedAction);
  });

  it('reducer should handle COUNTER_MINUS_ONE', () => {
    const prevState = { count: 8 };
    const state = reducer(
      prevState,
      { type: COUNTER_MINUS_ONE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(7);
  });
});
