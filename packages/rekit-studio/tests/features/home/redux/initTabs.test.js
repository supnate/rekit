import { expect } from 'chai';

import {
  HOME_INIT_TABS,
} from 'src/features/home/redux/constants';

import {
  initTabs,
  reducer,
} from 'src/features/home/redux/initTabs';

describe('home/redux/initTabs', () => {
  it('returns correct action by initTabs', () => {
    expect(initTabs()).to.have.property('type', HOME_INIT_TABS);
  });

  it('handles action type HOME_INIT_TABS correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_INIT_TABS }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
