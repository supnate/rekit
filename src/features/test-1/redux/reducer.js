import initialState from './initialState';
import { reducer as test1TestAction } from './test1TestAction';

const reducers = [
  test1TestAction,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
