import { expect } from 'chai';

import {
  TEST_2_TEST_ACTION,
} from 'features/test-2/redux/constants';

import {
  test2TestAction,
  reducer,
} from 'features/test-2/redux/test2TestAction';

describe('test-2/redux/test2TestAction', () => {
  it('action: test2TestAction', () => {
    const expectedAction = {
      type: TEST_2_TEST_ACTION,
    };
    expect(test2TestAction()).to.deep.equal(expectedAction);
  });

  it('reducer should handle TEST_2_TEST_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TEST_2_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
