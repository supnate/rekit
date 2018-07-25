import { expect } from 'chai';

import {
  CORE_SHOW_DIALOG,
} from 'src/features/core/redux/constants';

import {
  showDialog,
  reducer,
} from 'src/features/core/redux/showDialog';

describe('core/redux/showDialog', () => {
  it('returns correct action by showDialog', () => {
    expect(showDialog()).to.have.property('type', CORE_SHOW_DIALOG);
  });

  it('handles action type DIALOG_SHOW_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CORE_SHOW_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
