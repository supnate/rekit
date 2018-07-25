import { expect } from 'chai';

import {
  HOME_SHOW_DIALOG,
} from 'src/features/home/redux/constants';

import {
  showDialog,
  reducer,
} from 'src/features/home/redux/showDialog';

describe('home/redux/showDialog', () => {
  it('returns correct action by showDialog', () => {
    expect(showDialog()).to.have.property('type', HOME_SHOW_DIALOG);
  });

  it('handles action type HOME_SHOW_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SHOW_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
