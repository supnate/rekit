import { expect } from 'chai';

import {
  ${_.upperSnakeCase(actionType)},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
  reducer,
} from 'src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  it('action: ${_.camelCase(action)}', () => {
    const expectedAction = {
      type: ${_.upperSnakeCase(actionType)},
    };
    expect(${_.camelCase(action)}()).to.deep.equal(expectedAction);
  });

  it('reducer should handle ${_.upperSnakeCase(actionType)}', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${_.upperSnakeCase(actionType)} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
