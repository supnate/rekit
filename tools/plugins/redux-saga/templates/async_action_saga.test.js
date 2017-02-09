import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
  dismiss${_.pascalCase(action)}Error,
  do${_.pascalCase(action)},
  reducer,
} from 'src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by ${_.camelCase(action)}', () => {
    expect(${_.camelCase(action)}()).to.have.property('type', ${actionTypes.begin});
  });

  it('returns correct action by dismiss${_.pascalCase(action)}Error', () => {
    expect(dismiss${_.pascalCase(action)}Error()).to.have.property('type', ${actionTypes.dismissError});
  });

  // saga tests
  const generator = do${_.pascalCase(action)}();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches ${actionTypes.success} action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: ${actionTypes.success},
      data: 'something',
    }));
  });

  it('dispatches ${actionTypes.failure} action when failed', () => {
    const generatorForError = do${_.pascalCase(action)}();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: ${actionTypes.failure},
      error: err,
    }));
  });

  it('should be done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type ${actionTypes.begin} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: false };
    const state = reducer(
      prevState,
      { type: ${actionTypes.begin} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).to.be.true;
  });

  it('handles action type ${actionTypes.success} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: true };
    const state = reducer(
      prevState,
      { type: ${actionTypes.success}, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).to.be.false;
  });

  it('handles action type ${actionTypes.failure} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: true };
    const state = reducer(
      prevState,
      { type: ${actionTypes.failure}, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).to.be.false;
    expect(state.${_.camelCase(action)}Error).to.exist;
  });

  it('handles action type ${actionTypes.dismissError} correctly', () => {
    const prevState = { ${_.camelCase(action)}Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ${actionTypes.dismissError} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Error).to.be.null;
  });
});