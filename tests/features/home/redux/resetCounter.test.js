import { expect } from 'chai';

import {
  HOME_RESET_COUNTER,
} from 'src/features/home/redux/constants';

import {
  resetCounter,
  reducer,
} from 'src/features/home/redux/resetCounter';

describe('home/redux/resetCounter', () => {
  it('action: resetCounter', () => {
    const expectedAction = {
      type: HOME_RESET_COUNTER,
    };
    expect(resetCounter()).to.deep.equal(expectedAction);
  });

  it('reducer should handle HOME_RESET_COUNTER', () => {
    const prevState = { count: 10 };
    const state = reducer(
      prevState,
      { type: HOME_RESET_COUNTER }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.count).to.equal(0);
  });
});
