import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import {
  test2TestAction,
  myAsyncAction,
  dismissMyAsyncActionError,
} from 'features/test-2/actions';
import {
  TEST_2_TEST_ACTION,
  MY_ASYNC_ACTION_BEGIN,
  MY_ASYNC_ACTION_SUCCESS,
  MY_ASYNC_ACTION_FAILURE,
  MY_ASYNC_ACTION_DISMISS_ERROR,
} from 'features/test-2/constants';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('test-2/actions', function() { // eslint-disable-line
  this.timeout(10000);

  it('test2TestAction', () => {
    const expectedAction = {
      type: TEST_2_TEST_ACTION,
    };
    expect(test2TestAction()).to.deep.equal(expectedAction);
  });

  it('myAsyncAction success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: MY_ASYNC_ACTION_BEGIN },
      { type: MY_ASYNC_ACTION_SUCCESS, data: {} },
    ];

    return store.dispatch(myAsyncAction({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('myAsyncAction failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: MY_ASYNC_ACTION_BEGIN },
      { type: MY_ASYNC_ACTION_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(myAsyncAction({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dismissMyAsyncActionError', () => {
    const expectedAction = {
      type: MY_ASYNC_ACTION_DISMISS_ERROR,
    };
    expect(dismissMyAsyncActionError()).to.deep.equal(expectedAction);
  });
});
