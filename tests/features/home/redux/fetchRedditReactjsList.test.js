import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN,
  HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS,
  HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE,
  HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchRedditReactjsList,
  dismissFetchRedditReactjsListError,
  reducer,
} from 'src/features/home/redux/fetchRedditReactjsList';

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

    return store.dispatch(fetchRedditReactjsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS);
      });
  });

  it('handles fetchRedditReactjsList failure', () => {
    nock('http://www.reddit.com/')
      .get('/r/reactjs.json')
      .reply(500, null);
    const store = mockStore({ redditReactjsList: [] });

    return store.dispatch(fetchRedditReactjsList())
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error').that.exist;
      });
  });

  it('dismissFetchRedditReactjsListError', () => {
    const expectedAction = {
      type: HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchRedditReactjsListError()).to.deep.equal(expectedAction);
  });

  it(`reducer should handle ${HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_REACTJS_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.true;
  });

  it(`reducer should handle ${HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_REACTJS_LIST_SUCCESS, data: { data: { children: [] } } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.redditReactjsList).to.exist;
  });

  it(`reducer should handle ${HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE}`, () => {
    const prevState = { fetchRedditReactjsListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_REACTJS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListPending).to.be.false;
    expect(state.fetchRedditReactjsListError).to.exist;
  });

  it(`reducer should handle ${HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR}`, () => {
    const prevState = { fetchRedditReactjsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_REACTJS_LIST_DISMISS_ERROR, data: {} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.fetchRedditReactjsListError).to.be.null;
  });
});
