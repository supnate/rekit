import { expect } from 'chai';

import {
  HOME_COUNTER_MINUS_ONE,
} from 'src/features/home/redux/constants';

import {
  counterMinusOne,
  reducer,
} from 'src/features/home/redux/counterMinusOne';

describe('home/redux/counterMinusOne', () => {
  it('action: counterMinusOne', () => {
    const expectedAction = {
      type: HOME_COUNTER_MINUS_ONE,
    };
    expect(counterMinusOne()).to.deep.equal(expectedAction);
  });

  it('reducer should handle HOME_COUNTER_MINUS_ONE', () => {
    const prevState = { count: 8 };
    const state = reducer(
      prevState,
      { type: HOME_COUNTER_MINUS_ONE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(7);
  });
});
