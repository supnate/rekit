import { expect } from 'chai';

import {
  HOME_CODE_CHANGE,
} from 'src/features/home/redux/constants';

import {
  codeChange,
  reducer,
} from 'src/features/home/redux/codeChange';

describe('home/redux/codeChange', () => {
  it('returns correct action by codeChange', () => {
    expect(codeChange()).to.have.property('type', HOME_CODE_CHANGE);
  });

  it('handles action type HOME_CODE_CHANGE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_CODE_CHANGE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
