import { expect } from 'chai';

import {
  EDITOR_SET_OUTLINE_WIDTH,
} from 'src/features/editor/redux/constants';

import {
  setOutlineWidth,
  reducer,
} from 'src/features/editor/redux/setOutlineWidth';

describe('editor/redux/setOutlineWidth', () => {
  it('returns correct action by setOutlineWidth', () => {
    expect(setOutlineWidth()).to.have.property('type', EDITOR_SET_OUTLINE_WIDTH);
  });

  it('handles action type EDITOR_SET_OUTLINE_WIDTH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: EDITOR_SET_OUTLINE_WIDTH }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
