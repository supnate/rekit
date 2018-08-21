// import _ from 'lodash';
import { createSelector } from 'reselect';

const elementsSelector = state => state.elements;
const elementByIdSelector = state => state.elementById;

let byId;

const getTreeNode = elementId => {
  const element = byId(elementId);
  return {
    ...element,
    key: elementId,
    children: element.children && element.children.map(child => getTreeNode(child)),
  };
};

export const getTreeData = createSelector(elementsSelector, elementByIdSelector, (elements, elementById) => {
  byId = id => elementById[id] || null;
  const treeData = elements.map(getTreeNode);
  return treeData;
});

export const getProjectElements = createSelector(elementsSelector, elementByIdSelector, (elements, elementById) => {
  const left = [...elements];
  const all = [];
  while (left.length) {
    const ele = elementById[left.pop()];
    if (ele) {
      if (ele.children) {
        left.push.apply(left, ele.children);
      } else {
        all.push(ele);
      }
    }
  }
  return all;
});
