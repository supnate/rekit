import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from '../../../../src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
  dismiss${_.pascalCase(action)}Error,
  reducer,
} from '../../../../src/features/${_.kebabCase(feature)}/redux/${_.camelCase(action)}';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('${_.kebabCase(feature)}/redux/${_.camelCase(action)}', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when ${_.camelCase(action)} succeeds', () => {
    const store = mockStore({});

    return store.dispatch(${_.camelCase(action)}())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ${actionTypes.begin});
        expect(actions[1]).toHaveProperty('type', ${actionTypes.success});
      });
  });

  it('dispatches failure action when ${_.camelCase(action)} fails', () => {
    const store = mockStore({});

    return store.dispatch(${_.camelCase(action)}({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ${actionTypes.begin});
        expect(actions[1]).toHaveProperty('type', ${actionTypes.failure});
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismiss${_.pascalCase(action)}Error', () => {
    const expectedAction = {
      type: ${actionTypes.dismissError},
    };
    expect(dismiss${_.pascalCase(action)}Error()).toEqual(expectedAction);
  });

  it('handles action type ${actionTypes.begin} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: false };
    const state = reducer(
      prevState,
      { type: ${actionTypes.begin} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).toBe(true);
  });

  it('handles action type ${actionTypes.success} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: true };
    const state = reducer(
      prevState,
      { type: ${actionTypes.success}, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).toBe(false);
  });

  it('handles action type ${actionTypes.failure} correctly', () => {
    const prevState = { ${_.camelCase(action)}Pending: true };
    const state = reducer(
      prevState,
      { type: ${actionTypes.failure}, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Pending).toBe(false);
    expect(state.${_.camelCase(action)}Error).toEqual(expect.anything());
  });

  it('handles action type ${actionTypes.dismissError} correctly', () => {
    const prevState = { ${_.camelCase(action)}Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ${actionTypes.dismissError} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${_.camelCase(action)}Error).toBe(null);
  });
});

