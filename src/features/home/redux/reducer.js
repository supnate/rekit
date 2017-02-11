import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';
import { reducer as resetCounter } from './resetCounter';
import { reducer as fetchRedditReactjsList } from './fetchRedditReactjsList';
import { reducer as fetchRedditBySaga } from './fetchRedditBySaga';
import { reducer as a1Reducer } from './a1';
import { reducer as a2Reducer } from './a2';
import { reducer as a5Reducer } from './a5';

const reducers = [
  counterPlusOne,
  counterMinusOne,
  resetCounter,
  fetchRedditReactjsList,
  fetchRedditBySaga,
  a1Reducer,
  a2Reducer,
  a5Reducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
