import { expect } from 'chai';

import {
  COUNTER_PLUS_ONE,
} from 'features/home/redux/constants';

import {
  counterPlusOne,
  reducer,
} from 'features/home/redux/counterPlusOne';

describe('home/redux/counterPlusOne', () => {
  it('action: counterPlusOne', () => {
    const expectedAction = {
      type: COUNTER_PLUS_ONE,
    };
    expect(counterPlusOne()).to.deep.equal(expectedAction);
  });

  it(`reducer should handle ${COUNTER_PLUS_ONE}`, () => {
    const prevState = { count: 0 };
    const state = reducer(
      prevState,
      { type: COUNTER_PLUS_ONE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(1);
  });
});
