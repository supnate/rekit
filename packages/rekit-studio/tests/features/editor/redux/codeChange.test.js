import { expect } from 'chai';

import {
  EDITOR_CODE_CHANGE,
} from 'src/features/editor/redux/constants';

import {
  codeChange,
  reducer,
} from 'src/features/editor/redux/codeChange';

describe('editor/redux/codeChange', () => {
  it('returns correct action by codeChange', () => {
    expect(codeChange()).to.have.property('type', EDITOR_CODE_CHANGE);
  });

  it('handles action type EDITOR_CODE_CHANGE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: EDITOR_CODE_CHANGE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
