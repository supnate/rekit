import { expect } from 'chai';

import {
  HOME_HIDE_DIALOG,
} from 'src/features/home/redux/constants';

import {
  hideDialog,
  reducer,
} from 'src/features/home/redux/hideDialog';

describe('home/redux/hideDialog', () => {
  it('returns correct action by hideDialog', () => {
    expect(hideDialog()).to.have.property('type', HOME_HIDE_DIALOG);
  });

  it('handles action type HOME_HIDE_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_HIDE_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
