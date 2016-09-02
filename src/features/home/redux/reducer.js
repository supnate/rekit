// AUTO MAINTAINED FILE: DO NOT CHANGE

import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';
import { reducer as resetCounter } from './resetCounter';
import { reducer as fetchRedditReactjsList } from './fetchRedditReactjsList';

const reducers = [
  counterPlusOne,
  counterMinusOne,
  resetCounter,
  fetchRedditReactjsList,
];

export default function reducer(state = initialState, action) {
  return Object.values(reducers).reduce((s, r) => r(s, action), state);
}
