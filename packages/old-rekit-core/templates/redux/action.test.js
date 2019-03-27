import { expect } from 'chai';

import {
  ${actionType},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
  reducer,
} from 'src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  it('returns correct action by ${_.camelCase(action)}', () => {
    expect(${_.camelCase(action)}()).to.have.property('type', ${actionType});
  });

  it('handles action type ${actionType} correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${actionType} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
