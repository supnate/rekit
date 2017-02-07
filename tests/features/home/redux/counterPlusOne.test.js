import { expect } from 'chai';

import {
  HOME_COUNTER_PLUS_ONE,
} from 'src/features/home/redux/constants';

import {
  counterPlusOne,
  reducer,
} from 'src/features/home/redux/counterPlusOne';

describe('home/redux/counterPlusOne', () => {
  it('action: counterPlusOne', () => {
    const expectedAction = {
      type: HOME_COUNTER_PLUS_ONE,
    };
    expect(counterPlusOne()).to.deep.equal(expectedAction);
  });

  it(`reducer should handle ${HOME_COUNTER_PLUS_ONE}`, () => {
    const prevState = { count: 0 };
    const state = reducer(
      prevState,
      { type: HOME_COUNTER_PLUS_ONE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(1);
  });
});
