import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchProjectData,
  dismissFetchProjectDataError,
  reducer,
} from 'src/features/home/redux/fetchProjectData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchProjectData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchProjectData succeeds', () => {
    nock('http://localhost')
      .get('/rekit/api/project-data')
      .reply(200, { features: [] });
    const store = mockStore({});

    return store.dispatch(fetchProjectData())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_PROJECT_DATA_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_PROJECT_DATA_SUCCESS);
      });
  });

  it('dispatches failure action when fetchProjectData fails', () => {
    nock('http://localhost')
      .get('/rekit/api/project-data')
      .reply(500, { features: [] });
    const store = mockStore({});

    return store.dispatch(fetchProjectData({}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_FETCH_PROJECT_DATA_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_FETCH_PROJECT_DATA_FAILURE);
        expect(actions[1]).to.have.deep.property('data.error');
      });
  });

  it('returns correct action by dismissFetchProjectDataError', () => {
    const expectedAction = {
      type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
    };
    expect(dismissFetchProjectDataError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_BEGIN correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.true;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_SUCCESS correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_SUCCESS, data: { features: [], srcFiles: [] } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.false;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_FAILURE correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.false;
    expect(state.fetchProjectDataError).to.exist;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataError).to.be.null;
  });
});
