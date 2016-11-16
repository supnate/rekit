import { expect } from 'chai';

import {
  TEST_1_TEST_ACTION,
} from 'features/test-1/redux/constants';

import {
  test1TestAction,
  reducer,
} from 'features/test-1/redux/test1TestAction';

describe('test-1/redux/test1TestAction', () => {
  it('action: test1TestAction', () => {
    const expectedAction = {
      type: TEST_1_TEST_ACTION,
    };
    expect(test1TestAction()).to.deep.equal(expectedAction);
  });

  it('reducer should handle TEST_1_TEST_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TEST_1_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
