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
    const state = reducer(
      { count: 0 },
      { type: COUNTER_PLUS_ONE }
    );
    expect(state.count).to.equal(1);
  });
});
