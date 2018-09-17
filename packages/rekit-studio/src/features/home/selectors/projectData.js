// import _ from 'lodash';
import { createSelector } from 'reselect';
import _ from 'lodash';

const elementsSelector = state => state.elements;
const elementByIdSelector = state => state.elementById;

export const getTreeData = createSelector(
  elementsSelector,
  elementByIdSelector,
  (elements, elementById) => {
    const byId = id => elementById[id] || null;
    const getTreeNode = elementId => {
      const element = byId(elementId);
      return {
        ...element,
        key: elementId,
        children: element.children && element.children.map(child => getTreeNode(child)),
      };
    };
    const treeData = elements.map(getTreeNode);
    return treeData;
  }
);

// Get all project elements which displayed in project explorer
export const getProjectElements = createSelector(
  elementsSelector,
  elementByIdSelector,
  (elements, elementById) => {
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
  }
);

export const getDepsData = createSelector(elementByIdSelector, elementById => {
  // const byId = id => elementById[id] || null;
  const dependencies = {};
  const dependents = {};
  const ensuareArray = (obj, name) => (obj[name] ? obj[name] : (obj[name] = []));
  Object.values(elementById).forEach(ele => {
    if (ele.deps && ele.deps.length) {
      ele.deps.forEach(dep => {
        if (dep.type !== 'file') return;
        ensuareArray(dependencies, ele.id).push(dep.id);
        ensuareArray(dependents, dep.id).push(ele.id);
      });
    }
  });
  return { dependencies, dependents };
});

export const getGroupedDepsData = createSelector(elementByIdSelector, elementById => {
  const byId = id => elementById[id] || null;
  const ensuareArray = (obj, name) => (obj[name] ? obj[name] : (obj[name] = []));
  const dependencies = {};
  const dependents = {};

  Object.values(elementById).forEach(ele => {
    if (ele.target) ele = byId(ele.target);
    if (!ele) {
      // it seems only happend for 'src' folder.
      return;
    }
    let eleDeps = ele.parts
      ? ele.parts.reduce((prev, part) => {
          if (byId(part) && byId(part).deps) {
            prev.push.apply(prev, byId(part).deps);
          }
          return prev;
        }, [])
      : ele.deps || [];

    // deps should not in parts and uniq
    eleDeps = eleDeps
      .filter(d => d.type === 'file' && (!ele.parts || !ele.parts.includes(d.id)))
      .map(d => d.id);
    eleDeps = _.uniq(eleDeps);
    eleDeps.forEach(dep => {
      dep = byId(dep);
      if (!dep) return;
      if (dep.owner) dep = byId(dep.owner);
      if (!dep || dep.id === ele.id) return;
      ensuareArray(dependencies, ele.id).push(dep.id);
      ensuareArray(dependents, dep.id).push(ele.id);
    });
  });

  return { dependencies, dependents };
});

export const getTypesCount = createSelector(elementByIdSelector, elementById => {
  const count = {};
  Object.values(elementById).forEach(ele => {
    count[ele.type] = (count[ele.type] || 0) + 1;
  });

  return count;
});
