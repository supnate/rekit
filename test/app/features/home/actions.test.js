import { expect } from 'chai';
import {
  counterPlusOne,
  counterMinusOne,
  resetCount,
} from 'features/home/actions';

import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
} from 'features/home/constants';

describe('home/actions', () => {
  it('counterPlusOne', () => {
    const expectedAction = {
      type: COUNTER_PLUS_ONE,
    };
    expect(counterPlusOne()).to.deep.equal(expectedAction);
  });

  it('counterMinusOne', () => {
    const expectedAction = {
      type: COUNTER_MINUS_ONE,
    };
    expect(counterMinusOne()).to.deep.equal(expectedAction);
  });

  it('resetCount', () => {
    const expectedAction = {
      type: RESET_COUNTER,
    };
    expect(resetCount()).to.deep.equal(expectedAction);
  });
});
