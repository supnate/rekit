import { expect } from 'chai';
import reducer from 'features/${KEBAB_FEATURE_NAME}/reducer';
import {
} from 'features/${KEBAB_FEATURE_NAME}/constants';

describe('features/${KEBAB_FEATURE_NAME}/reducer', () => {
  it('should have initial state', () => {
    const state = reducer(
      undefined,
      { type: '_unknown_action_' }
    );
    expect(state).to.exist;
  });

  it('should do nothing without matched action', () => {
    const prevState = { count: 0 };
    const state = reducer(
      prevState,
      { type: '_unknown_action_type_' }
    );
    expect(state).to.equal(prevState);
  });
});
