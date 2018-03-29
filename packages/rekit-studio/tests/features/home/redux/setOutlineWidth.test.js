import { expect } from 'chai';

import {
  HOME_SET_OUTLINE_WIDTH,
} from 'src/features/home/redux/constants';

import {
  setOutlineWidth,
  reducer,
} from 'src/features/home/redux/setOutlineWidth';

describe('home/redux/setOutlineWidth', () => {
  it('returns correct action by setOutlineWidth', () => {
    expect(setOutlineWidth()).to.have.property('type', HOME_SET_OUTLINE_WIDTH);
  });

  it('handles action type HOME_SET_OUTLINE_WIDTH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_OUTLINE_WIDTH }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
