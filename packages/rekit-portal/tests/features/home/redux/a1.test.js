import { expect } from 'chai';

import {
  HOME_A_1,
} from 'src/features/home/redux/constants';

import {
  a1,
  reducer,
} from 'src/features/home/redux/a1';

describe('home/redux/a1', () => {
  it('returns correct action by a1', () => {
    expect(a1()).to.have.property('type', HOME_A_1);
  });

  it('handles action type HOME_A_1 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_A_1 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
