import { expect } from 'chai';

import {
  HOME_UPDATE_PROJECT_DATA,
} from 'src/features/home/redux/constants';

import {
  updateProjectData,
  reducer,
} from 'src/features/home/redux/updateProjectData';

describe('home/redux/updateProjectData', () => {
  it('returns correct action by updateProjectData', () => {
    expect(updateProjectData()).to.have.property('type', HOME_UPDATE_PROJECT_DATA);
  });

  it('handles action type HOME_UPDATE_PROJECT_DATA correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PROJECT_DATA }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
