import { createSelector } from 'reselect';

const elementByIdSelector = state => state.elementById;

export const getElementDiagramData = createSelector(
  elementByIdSelector,
  (elementById) => {
    const count = {};
    Object.values(elementById).forEach(ele => {
      count[ele.type] = (count[ele.type] || 0) + 1;
    });

    return count;
  },
);
