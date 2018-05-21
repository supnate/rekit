import { expect } from 'chai';

import {
  EDITOR_DO_SYNC,
} from 'src/features/editor/redux/constants';

import {
  doSync,
  reducer,
} from 'src/features/editor/redux/doSync';

describe('editor/redux/doSync', () => {
  it('returns correct action by doSync', () => {
    expect(doSync()).to.have.property('type', EDITOR_DO_SYNC);
  });

  it('handles action type EDITOR_DO_SYNC correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: EDITOR_DO_SYNC }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
