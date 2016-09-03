import { expect } from 'chai';
import reducer from 'features/home/reducer';
import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from 'features/home/constants';

describe('features/home/reducer', () => {
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

  it(`should handle ${COUNTER_PLUS_ONE}`, () => {
    const state = reducer(
      { count: 0 },
      { type: COUNTER_PLUS_ONE }
    );
    expect(state.count).to.equal(1);
  });

  it(`should handle ${COUNTER_MINUS_ONE}`, () => {
    const state = reducer(
      { count: 6 },
      { type: COUNTER_MINUS_ONE }
    );
    expect(state.count).to.equal(5);
  });

  it(`should handle ${RESET_COUNTER}`, () => {
    const state = reducer(
      { count: 5 },
      { type: RESET_COUNTER }
    );
    expect(state.count).to.equal(0);
  });

  it(`should handle ${FETCH_REDDIT_REACTJS_LIST_BEGIN}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.true;
  });

  it(`should handle ${FETCH_REDDIT_REACTJS_LIST_SUCCESS}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_SUCCESS, data: { data: { children: [] } } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.redditReactjsList).to.exist;
  });

  it(`should handle ${FETCH_REDDIT_REACTJS_LIST_FAILURE}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.fetchRedditReactjsListError).to.exist;
  });

  it(`should handle ${FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR}`, () => {
    const prevState = { fetchRedditReactjsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR, data: {} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListError).to.be.null;
  });
});
