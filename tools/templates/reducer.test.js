import { expect } from 'chai';
import reducer from 'src/features/${_.kebabCase(feature)}/redux/reducer';

describe('feature/${_.kebabCase(feature)}/redux/reducer', () => {
  it('feature ${_.kebabCase(feature)} reducer should do nothing if no matched action', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: '__UNKNOWN_ACTION_TYPE__' }
    );
    expect(state).to.equal(prevState);
  });

  // TODO: add global reducer test if needed.
});
