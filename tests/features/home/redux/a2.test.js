import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_A_2_BEGIN,
  HOME_A_2_SUCCESS,
  HOME_A_2_FAILURE,
  HOME_A_2_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  a2,
  dismissA2Error,
  doA2,
  reducer,
} from 'src/features/home/redux/a2';

describe('home/redux/a2', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by a2', () => {
    expect(a2()).to.have.property('type', HOME_A_2_BEGIN);
  });

  it('returns correct action by dismissA2Error', () => {
    expect(dismissA2Error()).to.have.property('type', HOME_A_2_DISMISS_ERROR);
  });

  // saga tests
  const generator = doA2();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_A_2_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_A_2_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_A_2_FAILURE action when failed', () => {
    const generatorForError = doA2();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_A_2_FAILURE,
      error: err,
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_A_2_BEGIN correctly', () => {
    const prevState = { a2Pending: false };
    const state = reducer(
      prevState,
      { type: HOME_A_2_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.true;
  });

  it('handles action type HOME_A_2_SUCCESS correctly', () => {
    const prevState = { a2Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_2_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.false;
  });

  it('handles action type HOME_A_2_FAILURE correctly', () => {
    const prevState = { a2Pending: true };
    const state = reducer(
      prevState,
      { type: HOME_A_2_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Pending).to.be.false;
    expect(state.a2Error).to.exist;
  });

  it('handles action type HOME_A_2_DISMISS_ERROR correctly', () => {
    const prevState = { a2Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_A_2_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.a2Error).to.be.null;
  });
});