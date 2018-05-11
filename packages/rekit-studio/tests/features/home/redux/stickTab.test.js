import { expect } from 'chai';

import {
  HOME_STICK_TAB,
} from 'src/features/home/redux/constants';

import {
  stickTab,
  reducer,
} from 'src/features/home/redux/stickTab';

describe('home/redux/stickTab', () => {
  it('returns correct action by stickTab', () => {
    expect(stickTab()).to.have.property('type', HOME_STICK_TAB);
  });

  it('handles action type HOME_STICK_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_STICK_TAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
