import { expect } from 'chai';
import {
  test2TestAction,
  aa22,
} from 'features/test-2/actions';
import {
  TEST_2_TEST_ACTION,
  AA_22,
} from 'features/test-2/constants';

describe('test-2/actions', () => {
  it('test2TestAction', () => {
    const expectedAction = {
      type: TEST_2_TEST_ACTION,
    };
    expect(test2TestAction()).to.deep.equal(expectedAction);
  });

  it('aa22', () => {
    const expectedAction = {
      type: AA_22,
    };
    expect(aa22()).to.deep.equal(expectedAction);
  });
});
