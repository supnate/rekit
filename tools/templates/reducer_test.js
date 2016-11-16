import { expect } from 'chai';
import reducer from 'features/${KEBAB_FEATURE_NAME}/redux/reducer';

describe('feature/${KEBAB_FEATURE_NAME}/redux/reducer', () => {
  it('feature ${KEBAB_FEATURE_NAME} reducer should do nothing if no matched action', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: '__unknown_action_type__' }
    );
    expect(state).to.equal(prevState);
  });

  // TODO: add global reducer test if needed.
});
