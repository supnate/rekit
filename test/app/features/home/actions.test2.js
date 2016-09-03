import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';
import {
  counterPlusOne,
  counterMinusOne,
  resetCount,
  fetchRedditReactjsList,
  dismissFetchRedditReactjsListError,
} from 'features/home/actions';

import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
  FETCH_REDDIT_REACTJS_LIST_BEGIN,
  FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  FETCH_REDDIT_REACTJS_LIST_FAILURE,
  FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from 'features/home/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('counterPlusOne', () => {
    const expectedAction = {
      type: COUNTER_PLUS_ONE,
    };
    expect(counterPlusOne()).to.deep.equal(expectedAction);
  });

  it('counterMinusOne', () => {
    const expectedAction = {
      type: COUNTER_MINUS_ONE,
    };
    expect(counterMinusOne()).to.deep.equal(expectedAction);
  });

  it('resetCount', () => {
    const expectedAction = {
      type: RESET_COUNTER,
    };
    expect(resetCount()).to.deep.equal(expectedAction);
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
});
