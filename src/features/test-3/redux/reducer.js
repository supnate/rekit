import initialState from './initialState';
import { reducer as test3TestAction } from './test3TestAction';

const reducers = [
  test3TestAction,
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
