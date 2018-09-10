import _ from 'lodash';
const colorMap = {
  feature: '#0277bd',
  action: '#ec407a',
  actions: '#ec407a',
  'initial-state': '#ec407a',
  component: '#f08036',
  components: '#f08036',
  'folder-alias': '#8d6e63',
  normal: '#888888',
  routes: '#26a69a',
  plugin: '#4CAF50',
};

const iconMap = {
  features: 'rekit',
  feature: 'book',
  action: 'notification',
  actions: 'notification',
  'initial-state': 'database',
  component: 'appstore-o',
  components: 'appstore-o',
  'folder-alias': 'folder',
  folder: 'folder',
  file: 'file',
  routes: 'sharealt',
  plugin: 'plugin',
};

const getRoutesNode = () => {
  return {
    id: 'v:routes',
    name: 'Routes',
    icon: iconMap.routes,
    iconColor: colorMap.routes,
  };
};
const getPagesNode = () => {
  return {
    id: 'v:pages',
    name: 'Pages',
    icon: 'file',
    iconColor: colorMap.plugin,
  };
};
const getUiModulesNode = () => {
  return {
    id: 'v:ui-modules',
    name: 'UI Modules',
    type: 'ui-modules',
    icon: iconMap.component,
    iconColor: colorMap.component,
  };
};
const getLayoutsNode = () => {
  return {
    id: 'v:layouts',
    name: 'Layouts',
    type: 'layouts',
    icon: 'ui',
    iconColor: '#CDDC39',
  };
};
const getServicesNode = () => {
  return {
    id: 'v:misc',
    type: 'folder-alias',
    name: 'Others',
    icon: 'api',
    iconColor: colorMap.action,
  };
};

const getOthersNode = () => {
  return {
    id: 'v:others',
    type: 'folder-alias',
    name: 'Others',
    icon: 'folder',
    iconColor: colorMap.misc,
  };
};

export default {
  processProjectData(prjData) {
    const byId = id => prjData.elementById[id];

    const rawElements = prjData.elements.slice();

    const rootChildren = [
      getRoutesNode(),
      getPagesNode(),
      getUiModulesNode(),
      getLayoutsNode(),
      getServicesNode(),
      getOthersNode(),
    ];
    rootChildren.forEach(c => (prjData.elementById[c.id] = c));
    prjData.elements = rootChildren.map(c => c.id);

    Object.values(prjData.elementById).forEach(ele => {});
  },
};
