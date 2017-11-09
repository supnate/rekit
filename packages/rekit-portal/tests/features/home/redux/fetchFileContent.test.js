import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_FILE_CONTENT_BEGIN,
  HOME_FETCH_FILE_CONTENT_SUCCESS,
  HOME_FETCH_FILE_CONTENT_FAILURE,
  HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchFileContent,
  dismissFetchFileContentError,
  reducer,
} from 'src/features/home/redux/fetchFileContent';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchFileContent', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchFileContent succeeds', () => {
    nock('http://localhost')
      .get('/rekit/api/file-content')
      .query(true)
      .reply(200, { content: 'file content' });
    const store = mockStore({});

    return store.dispatch(fetchFileContent('file'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_FILE_CONTENT_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_FILE_CONTENT_SUCCESS);
        expect(actions[1]).to.have.deep.property('data.content', 'file content');
      });
  });

  it('dispatches failure action when fetchFileContent fails', () => {
    nock('http://localhost')
      .get('/rekit/api/file-content')
      .query(true)
      .reply(500, {});
    const store = mockStore({});

    return store.dispatch(fetchFileContent('file'))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_FILE_CONTENT_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_FILE_CONTENT_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error');
      });
  });

  it('returns correct action by dismissFetchFileContentError', () => {
    const expectedAction = {
      type: HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
    };
    expect(dismissFetchFileContentError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_FETCH_FILE_CONTENT_BEGIN correctly', () => {
    const prevState = { fetchFileContentPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILE_CONTENT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchFileContentPending).to.be.true;
  });

  it('handles action type HOME_FETCH_FILE_CONTENT_SUCCESS correctly', () => {
    const prevState = { fetchFileContentPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILE_CONTENT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchFileContentPending).to.be.false;
  });

  it('handles action type HOME_FETCH_FILE_CONTENT_FAILURE correctly', () => {
    const prevState = { fetchFileContentPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILE_CONTENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchFileContentPending).to.be.false;
    expect(state.fetchFileContentError).to.exist;
  });

  it('handles action type HOME_FETCH_FILE_CONTENT_DISMISS_ERROR correctly', () => {
    const prevState = { fetchFileContentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILE_CONTENT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchFileContentError).to.be.null;
  });
});
