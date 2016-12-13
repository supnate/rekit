import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { expect } from 'chai';

import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
} from 'src/features/${_.kebabCase(feature)}/redux/sagas/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/sagas/${_.camelCase(action)}', () => {
  const generator = ${_.camelCase(action)}();

  it('should call delay(20)', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('should dispatch ${actionTypes.success} action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: ${actionTypes.success},
      data: 'something',
    }));
  });


  it('should dispatch ${actionTypes.failure} action when failed', () => {
    expect(generator.throw('error').value).to.deep.equal(put({
      type: ${actionTypes.failure},
      error: 'error',
    }));
  });

  it('should be done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });
});
