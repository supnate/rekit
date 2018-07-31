import { expect } from 'chai';

import {
  HOME_SET_URL_PATH_CHANGED,
} from 'src/features/home/redux/constants';

import {
  setUrlPathChanged,
  reducer,
} from 'src/features/home/redux/setUrlPathChanged';

describe('home/redux/setUrlPathChanged', () => {
  it('returns correct action by setUrlPathChanged', () => {
    expect(setUrlPathChanged()).to.have.property('type', HOME_SET_URL_PATH_CHANGED);
  });

  it('handles action type HOME_SET_URL_PATH_CHANGED correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_URL_PATH_CHANGED }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
