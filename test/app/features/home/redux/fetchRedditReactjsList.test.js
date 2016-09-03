import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  fetchRedditReactjsList,
  dismissFetchRedditReactjsListError,
  reducer,
} from 'features/home/redux/fetchRedditReactjsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchRedditReactjsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('handles fetchRedditReactjsList success', () => {
    const list = _.times(2, i => ({
      data: {
        id: `id${i}`,
        title: `test${i}`,
        url: `http://example.com/test${i}`,
      }
    }));
    nock('http://www.reddit.com/')
      .get('/r/reactjs.json')
      .reply(200, { data: { children: list } });
    const store = mockStore({ redditReactjsList: [] });

    const expectedActions = [
      { type: FETCH_REDDIT_REACTJS_LIST_BEGIN },
      { type: FETCH_REDDIT_REACTJS_LIST_SUCCESS, data: { data: { children: list } } },
    ];

    return store.dispatch(fetchRedditReactjsList())
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('handles fetchRedditReactjsList failure', () => {
    nock('http://www.reddit.com/')
      .get('/r/reactjs.json')
      .reply(500, null);
    const store = mockStore({ redditReactjsList: [] });

    const expectedActions = [
      { type: FETCH_REDDIT_REACTJS_LIST_BEGIN },
      { type: FETCH_REDDIT_REACTJS_LIST_FAILURE, data: {} },
    ];

    return store.dispatch(fetchRedditReactjsList())
      .then(() => {
        store.getActions().forEach((action, i) => {
          expect(_.isMatch(action, expectedActions[i])).to.be.true;
        });
      });
  });

  it('dismissFetchRedditReactjsListError', () => {
    const expectedAction = {
      type: FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchRedditReactjsListError()).to.deep.equal(expectedAction);
  });

  it(`reducer should handle ${FETCH_REDDIT_REACTJS_LIST_BEGIN}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.true;
  });

  it(`reducer should handle ${FETCH_REDDIT_REACTJS_LIST_SUCCESS}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_SUCCESS, data: { data: { children: [] } } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.redditReactjsList).to.exist;
  });

  it(`reducer should handle ${FETCH_REDDIT_REACTJS_LIST_FAILURE}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.fetchRedditReactjsListError).to.exist;
  });

  it(`reducer should handle ${FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR}`, () => {
    const prevState = { fetchRedditReactjsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR, data: {} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListError).to.be.null;
  });
});
