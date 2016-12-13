import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
  reducer,
} from 'src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when ${_.camelCase(action)} succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${actionTypes.begin} },
      { type: ${actionTypes.success}, data: {} },
    ];

    return store.dispatch(${_.camelCase(action)}({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when ${_.camelCase(action)} fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${actionTypes.begin} },
      { type: ${actionTypes.failure}, data: { error: 'some error' } },
    ];

    return store.dispatch(${_.camelCase(action)}({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismiss${_.pascalCase(action)}Error', () => {
    const expectedAction = {
      type: ${actionTypes.dismissError},
    };
    expect(dismiss${_.pascalCase(action)}Error()).to.deep.equal(expectedAction);
  });

  it('handles action type ${actionTypes.begin} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: true };
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
