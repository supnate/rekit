import { createSelector } from 'reselect';

// Selectors are very useful for React, Redux applications because they allow you don't care about
// how often computations are performed. So that you could create high performance apps with less complexity.
// See more at: https://github.com/reactjs/reselect

// Here is just a sample, you can add more state selectors.
const dataSelector = state => state.data;

// The exported selector, you can add more
export const ${_.camelCase(name)} = createSelector(
  dataSelector,
  data => data
);
