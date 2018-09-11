import _ from 'lodash';
const colorMap = {
  feature: '#0277bd',
  service: '#ec407a',
  services: '#ec407a',
  'initial-state': '#ec407a',
  'ui-module': '#f08036',
  'ui-modules': '#f08036',
  'folder-alias': '#8d6e63',
  normal: '#888888',
  routes: '#26a69a',
  page: '#4CAF50',
  layout: '#CDDC39',
  others: '#8d6e63',
};

const iconMap = {
  features: 'rekit',
  feature: 'book',
  service: 'notification',
  services: 'notification',
  'initial-state': 'database',
  'ui-module': 'appstore-o',
  'ui-modules': 'appstore-o',
  layout: 'ui',
  layouts: 'ui',
  'folder-alias': 'folder',
  folder: 'folder',
  others: 'folder',
  file: 'file',
  routes: 'sharealt',
  page: 'page',
};

let byId;
let rawElements;
let setById;

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
    icon: iconMap.page,
    iconColor: colorMap.page,
    children: (() => {
      const children = byId('src/pages').children.map(c => {
        const ele = byId(c);
        const p = {
          id: `v:${ele.id}`,
          name: ele.name,
          type: 'page',
          icon: iconMap.page,
        };
        setById(p.id, p);
        return p;
      });
      return children.map(c => c.id);
    })(),
  };
};
const getUiModulesNode = () => {
  return {
    id: 'v:ui-modules',
    name: 'UI Modules',
    type: 'ui-modules',
    icon: iconMap['ui-modules'],
    iconColor: colorMap['ui-modules'],
  };
};
const getLayoutsNode = () => {
  return {
    id: 'v:layouts',
    name: 'Layouts',
    type: 'layouts',
    icon: iconMap.layout,
    iconColor: colorMap.layout,
  };
};
const getServicesNode = () => {
  return {
    id: 'v:misc',
    type: 'folder-alias',
    name: 'Services',
    icon: iconMap.services,
    iconColor: colorMap.services,
  };
};

const getOthersNode = () => {
  return {
    id: 'v:others',
    type: 'folder-alias',
    name: 'Others',
    icon: iconMap.others,
    iconColor: colorMap.others,
    children: rawElements,
  };
};

export default {
  processProjectData(prjData) {
    byId = id => prjData.elementById[id];
    setById = (id, ele) => prjData.elementById[id] = ele;
    rawElements = prjData.elements.slice();

    const routesNode = getRoutesNode();
    const pagesNode = getPagesNode();
    const uiModulesNode = getUiModulesNode();
    const layoutsNode = getLayoutsNode();
    const servicesNode = getServicesNode();
    const othersNode = getOthersNode();
    const rootChildren = [
      routesNode,
      pagesNode,
      uiModulesNode,
      layoutsNode,
      servicesNode,
      othersNode,
    ];
    rootChildren.forEach(c => (prjData.elementById[c.id] = c));
    prjData.elements = rootChildren.map(c => c.id);

    Object.values(prjData.elementById).forEach(ele => {});
  },
};
