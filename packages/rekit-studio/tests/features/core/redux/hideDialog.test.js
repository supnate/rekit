import { expect } from 'chai';

import {
  CORE_HIDE_DIALOG,
} from 'src/features/core/redux/constants';

import {
  hideDialog,
  reducer,
} from 'src/features/core/redux/hideDialog';

describe('core/redux/hideDialog', () => {
  it('returns correct action by hideDialog', () => {
    expect(hideDialog()).to.have.property('type', CORE_HIDE_DIALOG);
  });

  it('handles action type CORE_UI_HIDE_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CORE_HIDE_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
