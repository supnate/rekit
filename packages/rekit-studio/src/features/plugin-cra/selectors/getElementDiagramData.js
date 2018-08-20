import _ from 'lodash';
import { createSelector } from 'reselect';
import { getDepsDiagramData } from '../../diagram/selectors/getDepsDiagramData';

const elementByIdSelector = elementById => elementById;
const elementIdSelector = (elementById, elementId) => elementId;

export const getElementDiagramData = createSelector(
  getDepsDiagramData,
  elementByIdSelector,
  elementIdSelector,
  (depsData, elementById, elementId) => {
    const { nodes, links } = depsData;

    return { nodes, links };
  },
);
