import { expect } from 'chai';

import {
  HOME_CLOSE_TAB,
} from 'src/features/home/redux/constants';

import {
  closeTab,
  reducer,
} from 'src/features/home/redux/closeTab';

describe('home/redux/closeTab', () => {
  it('returns correct action by closeTab', () => {
    expect(closeTab()).to.have.property('type', HOME_CLOSE_TAB);
  });

  it('handles action type HOME_CLOSE_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_CLOSE_TAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
