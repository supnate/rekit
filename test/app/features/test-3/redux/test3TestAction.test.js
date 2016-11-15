import { expect } from 'chai';

import {
  TEST_3_TEST_ACTION,
} from 'features/test-3/redux/constants';

import {
  test3TestAction,
  reducer,
} from 'features/test-3/redux/test3TestAction';

describe('test-3/redux/test3TestAction', () => {
  it('action: test3TestAction', () => {
    const expectedAction = {
      type: TEST_3_TEST_ACTION,
    };
    expect(test3TestAction()).to.deep.equal(expectedAction);
  });

  it('reducer should handle TEST_3_TEST_ACTION', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TEST_3_TEST_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
