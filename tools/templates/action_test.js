import { expect } from 'chai';

import {
  ${ACTION_TYPE},
} from 'features/${KEBAB_FEATURE_NAME}/redux/constants';

import {
  ${CAMEL_ACTION_NAME},
  reducer,
} from 'features/${KEBAB_FEATURE_NAME}/redux/${CAMEL_ACTION_NAME}';

describe('${KEBAB_FEATURE_NAME}/redux/${CAMEL_ACTION_NAME}', () => {
  it('action: ${CAMEL_ACTION_NAME}', () => {
    const expectedAction = {
      type: ${ACTION_TYPE},
    };
    expect(${CAMEL_ACTION_NAME}()).to.deep.equal(expectedAction);
  });

  it('reducer should handle ${ACTION_TYPE}', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
