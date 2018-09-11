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
  service: 'service',
  services: 'service',
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

const getElements = (dir, type) => {
  const children = byId(dir).children.map(c => {
    const ele = byId(c);
    const keyMap = {
      'style.less': 'Style',
      'template.marko': 'Template',
      'index.js': 'Index',
      'browser.json': 'Browser',
    };
    const viewName = id => {
      const name = byId(id).name;
      return keyMap[name] || name;
    };
    const views = ele.children
      .filter(cid => byId(cid).type === 'file')
      .map(cid => ({ key: viewName(cid).toLowerCase(), target: cid, name: viewName(cid) }));
    if (views.length) views[0].isDefault = true;
    const p = {
      id: `v:${ele.id}`,
      name: ele.name,
      type,
      icon: iconMap[type],
      tabIconColor: colorMap[type],
      navigable: true,
      views: [{ key: 'diagram', name: 'Diagram' }, ...views],
      parts: ele.children.filter(cid => byId(cid).type === 'file'),
    };
    setById(p.id, p);
    return p;
  });
  return children.map(c => c.id);
};

const getRoutesNode = () => {
  return {
    id: 'v:routes',
    name: 'Routes',
    type: 'routes',
    icon: iconMap.routes,
    iconColor: colorMap.routes,
    views: [{ key: 'rules', name: 'Rules' }, { key: 'code', name: 'Code', target: 'routes.json' }],
  };
};
const getPagesNode = () => {
  return {
    id: 'v:pages',
    name: 'Pages',
    type: 'pages',
    icon: iconMap.page,
    iconColor: colorMap.page,
    children: getElements('src/pages', 'page'),
  };
};
const getUiModulesNode = () => {
  return {
    id: 'v:ui-modules',
    name: 'UI Modules',
    type: 'ui-modules',
    icon: iconMap['ui-modules'],
    iconColor: colorMap['ui-modules'],
    children: getElements('src/ui-modules', 'ui-module'),
  };
};
const getLayoutsNode = () => {
  return {
    id: 'v:layouts',
    name: 'Layouts',
    type: 'layouts',
    icon: iconMap.layout,
    iconColor: colorMap.layout,
    children: getElements('src/layouts', 'layout'),
  };
};
const getServicesNode = () => {
  return {
    id: 'v:misc',
    type: 'services',
    name: 'Services',
    icon: iconMap.services,
    iconColor: colorMap.services,
    children: getElements('src/services', 'service'),
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
    setById = (id, ele) => (prjData.elementById[id] = ele);
    // setById('routes.json', {
    //   name: 'routes.json',
    //   id: 'routes.json',
    //   type: 'file',
    // });
    rawElements = prjData.elements.slice();

    const routesNode = getRoutesNode();
    const pagesNode = getPagesNode();
    const uiModulesNode = getUiModulesNode();
    const layoutsNode = getLayoutsNode();
    const servicesNode = getServicesNode();
    const othersNode = getOthersNode();

    pagesNode.count = pagesNode.children.length;
    uiModulesNode.count = uiModulesNode.children.length;
    layoutsNode.count = layoutsNode.children.length;
    servicesNode.count = servicesNode.children.length;

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

    Object.values(prjData.elementById).forEach(ele => {
      switch (ele.type) {
        case 'ui-module':
        case 'service':
        case 'layoutt':
        case 'file':
        case 'routes':
          ele.navigable = true;
          break;
        default:
          break;
      }
    });
  },
};
