import { expect } from 'chai';

import {
  HOME_OPEN_TAB,
} from 'src/features/home/redux/constants';

import {
  openTab,
  reducer,
} from 'src/features/home/redux/openTab';

describe('home/redux/openTab', () => {
  it('returns correct action by openTab', () => {
    expect(openTab()).to.have.property('type', HOME_OPEN_TAB);
  });

  it('handles action type HOME_OPEN_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_OPEN_TAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
