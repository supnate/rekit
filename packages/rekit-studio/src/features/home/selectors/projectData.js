import _ from 'lodash';
import { createSelector } from 'reselect';

const elementsSelector = state => state.elements;
const elementByIdSelector = state => state.elementById;

let byId;

const getTreeNode = elementId => {
  const element = byId(elementId);
  return {
    ...element,
    children: element.children && element.children.map(child => getTreeNode(child)),
  };
};

export const treeDataSelector = createSelector(
  elementsSelector,
  elementByIdSelector,
  (elements, elementById) => {
    byId = id => elementById[id] || null;
    const treeData = elements.map(getTreeNode);
    return treeData;
  }
);
