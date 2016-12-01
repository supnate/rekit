import { expect } from 'chai';

import {
  SAMPLE_ACTION,
} from 'src/features/common/redux/constants';

import {
  sampleAction,
  reducer,
} from 'src/features/common/redux/sampleAction';

describe('common/redux/sampleAction', () => {
  it('action: sampleAction', () => {
    const expectedAction = {
      type: SAMPLE_ACTION,
    };
    expect(sampleAction()).to.deep.equal(expectedAction);
  });

  it('reducer should handle SAMPLE_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: SAMPLE_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
