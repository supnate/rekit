import _ from 'lodash';
import { createSelector } from 'reselect';

const srcFilesSelector = state => state.srcFiles;
const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;
const keywordSelector = (state, keyword) => keyword;

function getMarks(feature, ele) {
  const marks = [];
  switch (ele.type) {
    case 'component':
      if (ele.connectToStore) marks.push('C');
      if (_.find(feature.routes, { component: ele.name })) marks.push('R');
      break;
    case 'action':
      if (ele.isAsync) marks.push('A');
      break;
    default:
      break;
  }
  return marks;
}

function getComponentsTreeData(feature) {
  const components = feature.components;

  return {
    key: `${feature.key}-components`,
    className: 'components',
    label: 'Components',
    icon: 'appstore-o',
    count: components.length,
    children: components.map(comp => ({
      key: comp.file,
      className: 'component',
      label: comp.name,
      icon: 'appstore-o',
      searchable: true,
      marks: getMarks(feature, comp),
    })),
  };
}

function getActionsTreeData(feature) {
  const actions = feature.actions;
  return {
    key: `${feature.key}-actions`,
    className: 'actions',
    label: 'Actions',
    icon: 'notification',
    count: actions.length,
    children: [{
      key: `src/features/${feature.key}/redux/initialState.js`,
      className: 'action initial-state',
      label: 'initialState',
      icon: 'star',
      searchable: true,
    }, ...actions.map(action => ({
      key: action.file,
      className: 'action',
      label: action.name,
      icon: 'notification',
      searchable: true,
      marks: getMarks(feature, action),
    }))],
  };
}

function getChildData(child) {
  if (_.endsWith(child.file, '/redux/initialState.js')) return null;

  if (/src\/features\/[^/]+\/route\.js$/.test(child.file)) return null;
  return {
    key: child.file,
    className: child.children ? 'misc-folder' : 'misc-file',
    label: child.name,
    icon: child.children ? 'folder' : 'file',
    searchable: !child.children,
    children: child.children ? _.compact(child.children.map(getChildData)) : null,
  };
}

function getMiscTreeData(feature) {
  const misc = feature.misc;
  return {
    key: `${feature.key}-misc`,
    className: 'misc',
    label: 'Misc',
    icon: 'folder',
    children: _.compact(misc.map(getChildData)),
  };
}

export const getExplorerTreeData = createSelector(
  srcFilesSelector,
  featuresSelector,
  featureByIdSelector,
  (srcFiles, features, featureById) => {
    const featureNodes = features.map((fid) => {
      const feature = featureById[fid];
      return {
        key: feature.key,
        className: 'feature',
        label: feature.name,
        icon: 'book',
        children: [
          { label: 'Routes', key: `src/features/${fid}/route.js`, searchable: false, className: 'routes', icon: 'share-alt', count: feature.routes.length },
          getActionsTreeData(feature),
          getComponentsTreeData(feature),
          getMiscTreeData(feature),
        ],
      };
    });

    const allNodes = [
      {
        key: 'features',
        label: 'Features',
        icon: 'features',
        children: _.compact(featureNodes),
      },
      {
        key: 'others-node',
        label: 'Others',
        className: 'others',
        icon: 'folder',
        children: srcFiles.map(getChildData),
      }
    ];
    return { root: true, children: allNodes };
  }
);

function filterTreeNode(node, keyword) {
  const reg = new RegExp(_.escapeRegExp(keyword), 'i');
  return {
    ...node,
    children: _.compact(node.children.map((child) => {
      if (child.searchable && reg.test(child.label)) return child;
      if (child.children) {
        const c = filterTreeNode(child, keyword);
        return c.children.length > 0 ? c : null;
      }
      return null;
    })),
  };
}

export const getFilteredExplorerTreeData = createSelector(
  getExplorerTreeData,
  keywordSelector,
  (treeData, keyword) => {
    if (!keyword) return treeData;
    return filterTreeNode(treeData, keyword);
  }
);

// when searching the tree, all nodes should be expanded, the tree component needs expandedKeys property.
export const getExpandedKeys = createSelector(
  getFilteredExplorerTreeData,
  (treeData) => {
    const keys = [];
    let arr = [...treeData.children];
    while (arr.length) {
      const pop = arr.pop();
      if (pop.children) {
        keys.push(pop.key);
        arr = [...arr, ...pop.children];
      }
    }
    return keys;
  }
);
