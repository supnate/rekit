import _ from 'lodash';
import colors from '../colors';
const colorMap = colors;

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

const getElement = (dir, type) => {
  const dirEle = byId(dir);
  if (!dirEle || dirEle.type !== 'folder') return null;
  const keyMap = {
    'style.less': 'Style',
    'template.marko': 'Template',
    'index.marko': 'Template',
    'unit-tests': 'Test',
    test: 'Test',
    'index.js': 'Index',
    'component.js': 'Component',
    'browser.json': 'Browser',
  };
  const sorted = ['Diagram', 'Index', 'Component', 'Template', 'Style', 'Browser', 'Test'];

  const viewName = id => {
    const name = byId(id).name;
    return keyMap[name] || name;
  };

  let views = dirEle.children
    .filter(cid => byId(cid).type === 'file' && !byId(cid).name.endsWith('.marko.js'))
    .map(cid => ({ key: viewName(cid).toLowerCase(), target: cid, name: viewName(cid) }));
  views = _.sortBy(views, v => {
    const i = sorted.indexOf(v.name);
    if (i !== -1) return i;
    return sorted.length + 1;
  });
  if (views.length) views[0].isDefault = true;
  views.push({
    key: '_btn_add',
    name: '+',
  });
  const ele = {
    id: `v:${dirEle.id}`,
    name: dirEle.name,
    type,
    icon: iconMap[type],
    iconColor: colorMap[type],
    navigable: true,
    views: [{ key: 'diagram', name: 'Diagram' }, ...views],
    parts: dirEle.children.filter(cid => byId(cid).type === 'file'),
  };
  setById(ele.id, ele);
  if (type === 'ui-module') {
    // ui module may have sub modules
    ele.children = dirEle.children
      .filter(c => {
        const ee = byId(c);
        if (ee.type === 'folder' && byId(`${ee.id}/component.js`) && byId(`${ee.id}/index.marko`)) {
          return true;
        }
        return false;
      })
      .map(c => getElement(c, type))
      .map(c => c.id);
  }
  return ele;
};

const getElements = (dir, type) => {
  if (!byId(dir) || byId(dir).type !== 'folder') return [];
  const children = byId(dir).children.map(c => getElement(c, type)).filter(e => !!e);
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
    children: [...getElements('src/components', 'ui-module'), ...getElements('src/ui-modules', 'ui-module')],
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
    children: _.without(rawElements, 'src/layouts', 'src/pages', 'src/services', 'src/ui-modules'),
  };
};

export default {
  processProjectData(prjData) {
    byId = id => prjData.elementById[id];
    setById = (id, ele) => (prjData.elementById[id] = ele);
    rawElements = prjData.elements.slice();

    const routesNode = getRoutesNode();
    const pagesNode = getPagesNode();
    const uiModulesNode = getUiModulesNode();
    const layoutsNode = getLayoutsNode();
    const servicesNode = getServicesNode();
    const othersNode = getOthersNode();

    routesNode.count = prjData.routes.length;
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
      if (ele.parts) {
        ele.parts.forEach(part => {
          if (byId(part)) byId(part).owner = ele.id;
        });
      }
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
