import { expect } from 'chai';
import {
  test1TestAction,
} from 'features/test-1/actions';

import {
  TEST_1_TEST_ACTION,
} from 'features/test-1/constants';

describe('test-1/actions', () => {
  it('test1TestAction', () => {
    const expectedAction = {
      type: TEST_1_TEST_ACTION,
    };
    expect(test1TestAction()).to.deep.equal(expectedAction);
  });
});
