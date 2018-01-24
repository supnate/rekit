import { expect } from 'chai';

import {
  HOME_MOVE_TAB,
} from 'src/features/home/redux/constants';

import {
  moveTab,
  reducer,
} from 'src/features/home/redux/moveTab';

describe('home/redux/moveTab', () => {
  it('returns correct action by moveTab', () => {
    expect(moveTab()).to.have.property('type', HOME_MOVE_TAB);
  });

  it('handles action type HOME_MOVE_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_MOVE_TAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
