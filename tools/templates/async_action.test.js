import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  ${BEGIN_ACTION_TYPE},
  ${SUCCESS_ACTION_TYPE},
  ${FAILURE_ACTION_TYPE},
  ${DISMISS_ERROR_ACTION_TYPE},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${CAMEL_ACTION_NAME},
  dismiss${_.pascalCase(action)}Error,
  reducer,
} from 'src/features/${_.kebabCase(feature)}/redux/${CAMEL_ACTION_NAME}';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('${_.kebabCase(feature)}/redux/${CAMEL_ACTION_NAME}', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle ${CAMEL_ACTION_NAME} success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${BEGIN_ACTION_TYPE} },
      { type: ${SUCCESS_ACTION_TYPE}, data: {} },
    ];

    return store.dispatch(${CAMEL_ACTION_NAME}({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle ${CAMEL_ACTION_NAME} failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${BEGIN_ACTION_TYPE} },
      { type: ${FAILURE_ACTION_TYPE}, data: { error: 'some error' } },
    ];

    return store.dispatch(${CAMEL_ACTION_NAME}({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismiss${_.pascalCase(action)}Error', () => {
    const expectedAction = {
      type: ${DISMISS_ERROR_ACTION_TYPE},
    };
    expect(dismiss${_.pascalCase(action)}Error()).to.deep.equal(expectedAction);
  });

  it('reducer should handle ${BEGIN_ACTION_TYPE}', () => {
    const prevState = { ${CAMEL_ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${BEGIN_ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${CAMEL_ACTION_NAME}Pending).to.be.true;
  });

  it('reducer should handle ${SUCCESS_ACTION_TYPE}', () => {
    const prevState = { ${CAMEL_ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${SUCCESS_ACTION_TYPE}, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${CAMEL_ACTION_NAME}Pending).to.be.false;
  });

  it('reducer should handle ${FAILURE_ACTION_TYPE}', () => {
    const prevState = { ${CAMEL_ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${FAILURE_ACTION_TYPE}, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${CAMEL_ACTION_NAME}Pending).to.be.false;
    expect(state.${CAMEL_ACTION_NAME}Error).to.exist;
  });

  it('reducer should handle ${DISMISS_ERROR_ACTION_TYPE}', () => {
    const prevState = { ${CAMEL_ACTION_NAME}Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ${DISMISS_ERROR_ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.${CAMEL_ACTION_NAME}Error).to.be.null;
  });
});
