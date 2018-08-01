import { expect } from 'chai';

import {
  HOME_SET_VIEW_CHANGED,
} from 'src/features/home/redux/constants';

import {
  setViewChanged,
  reducer,
} from 'src/features/home/redux/setViewChanged';

describe('home/redux/setViewChanged', () => {
  it('returns correct action by setViewChanged', () => {
    expect(setViewChanged()).to.have.property('type', HOME_SET_VIEW_CHANGED);
  });

  it('handles action type HOME_SET_VIEW_CHANGED correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_VIEW_CHANGED }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
