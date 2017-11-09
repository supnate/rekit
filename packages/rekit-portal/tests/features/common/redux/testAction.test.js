import { expect } from 'chai';

import {
  COMMON_TEST_ACTION,
} from 'src/features/common/redux/constants';

import {
  testAction,
  reducer,
} from 'src/features/common/redux/testAction';

describe('common/redux/testAction', () => {
  it('returns correct action by testAction', () => {
    const expectedAction = {
      type: COMMON_TEST_ACTION,
    };
    expect(testAction()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_ACTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
