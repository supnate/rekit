import { expect } from 'chai';

import {
  CONFIG_SET_DEPS_OUTPUT_HEIGHT,
} from 'src/features/config/redux/constants';

import {
  setDepsOutputHeight,
  reducer,
} from 'src/features/config/redux/setDepsOutputHeight';

describe('config/redux/setDepsOutputHeight', () => {
  it('returns correct action by setDepsOutputHeight', () => {
    expect(setDepsOutputHeight()).to.have.property('type', CONFIG_SET_DEPS_OUTPUT_HEIGHT);
  });

  it('handles action type CONFIG_SET_DEPS_OUTPUT_HEIGHT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CONFIG_SET_DEPS_OUTPUT_HEIGHT }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
