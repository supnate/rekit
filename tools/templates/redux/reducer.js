import initialState from './initialState';

const reducers = [
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  return Object.values(reducers).reduce((s, r) => r(s, action), newState);
}
