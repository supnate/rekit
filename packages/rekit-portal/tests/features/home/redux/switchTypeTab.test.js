import { expect } from 'chai';

import {
  HOME_SWITCH_TYPE_TAB,
} from 'src/features/home/redux/constants';

import {
  switchTypeTab,
  reducer,
} from 'src/features/home/redux/switchTypeTab';

describe('home/redux/switchTypeTab', () => {
  it('returns correct action by switchTypeTab', () => {
    expect(switchTypeTab()).to.have.property('type', HOME_SWITCH_TYPE_TAB);
  });

  it('handles action type HOME_SWITCH_TYPE_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_TYPE_TAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
