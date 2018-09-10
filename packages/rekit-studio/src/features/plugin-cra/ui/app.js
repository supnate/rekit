import _ from 'lodash';
const colorMap = {
  feature: '#0277bd',
  action: '#ec407a',
  actions: '#ec407a',
  'initial-state': '#ec407a',
  component: '#f08036',
  components: '#f08036',
  misc: '#8d6e63',
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
  misc: 'folder',
  folder: 'folder',
  file: 'file',
  routes: 'sharealt',
  plugin: 'plugin',
};

const getFeature = file => {
  return /^src\/features\/\w+\//.test(file) ? file.split('/')[2] : null;
};

export default {
  processProjectData(prjData) {
    const byId = id => prjData.elementById[id];
    const features = Object.values(prjData.elementById).filter(ele => ele.type === 'feature');
    const allRoutesDepsMap = features
      .map(f => `src/features/${f.name}/route.js`)
      .reduce((depsMap, routeFile) => {
        const ele = byId(routeFile);
        if (ele && ele.deps && ele.deps.length) {
          ele.deps.forEach(d => {
            depsMap[d.id] = true;
          });
        }
        return depsMap;
      }, {});

    Object.values(prjData.elementById).forEach(ele => {
      if (ele.type && iconMap[ele.type]) {
        ele.icon = iconMap[ele.type];
        ele.iconColor = colorMap[ele.type];
      }

      if (ele.parts) {
        ele.parts.forEach(part => {
          if (byId(part)) byId(part).owner = ele.id;
        });
      }

      if (ele.type === 'file') {
        switch (ele.ext) {
          case 'js':
          case 'svg':
          case 'less':
            ele.icon = `file_type_${ele.ext}`;
            break;
          case 'png':
          case 'jpg':
          case 'jpeg':
          case 'gif':
            ele.icon = 'file_type_image';
            break;
          default:
            break;
        }
      }

      switch (ele.type) {
        case 'components':
          ele.count = ele.children.length;

          break;
        case 'actions':
          ele.count = ele.children.length - 1;
          if (ele.props && ele.props.isAsync) {
            ele.marks = [{ name: 'A', description: 'Async action', bgColor: '#4fc3f7' }];
          }
          break;
        case 'component':
          // Uses Redux store
          if (ele.props && ele.props.connectToStore) {
            ele.marks = [
              { name: 'C', description: 'Connected to Redux Store', bgColor: '#42bd41' },
            ];
          }

          // Used in react router
          if (ele.parts && ele.parts[0] && allRoutesDepsMap[ele.parts[0]]) {
            ele.isInRoute = true;
            ele.marks = [
              ...(ele.marks || []),
              { name: 'R', description: 'Used in route config', bgColor: '#ffb300' },
            ];
          }
          break;
        case 'action':
          if (ele.props && ele.props.isAsync) {
            ele.marks = [{ name: 'A', description: 'Async action', bgColor: '#4fc3f7' }];
          }
          break;
        case 'routes':
          ele.count = ele.routes.length;
          break;
        case 'file':
        case 'folder':
          ele.feature = getFeature(ele.id);
          break;
        default:
          break;
      }

      if (ele.type === 'components') {
        ele.count = ele.children.length;
      }
      if (ele.type === 'actions') {
        ele.count = ele.children.length - 1;
      }

      if (ele.type === 'feature') {
        const coreDir = `src/features/${ele.name}/core`;
        const uiDir = `src/features/${ele.name}/ui`;
        if (byId(coreDir) && byId(uiDir)) {
          ele.icon = iconMap.plugin;
          ele.iconColor = colorMap.plugin;
          const misc = ele.children.pop();
          _.pull(byId(misc).children, coreDir, uiDir);

          const coreDirId = `v:${ele.name}-plugin-core-dir`;
          const uiDirId = `v:${ele.name}-plugin-ui-dir`;
          ele.children.push(coreDirId, uiDirId, misc);
          Object.assign(prjData.elementById, {
            [coreDirId]: {
              name: 'Core',
              target: coreDir,
              type: 'folder-alias',
              icon: 'core',
              children: byId(coreDir).children.slice(),
            },
            [uiDirId]: {
              name: 'UI',
              target: uiDir,
              type: 'folder-alias',
              icon: 'ui',
              children: byId(uiDir).children.slice(),
              iconColor: '#CDDC39',
            },
          });
        }
      }

      if (ele.children && ele.children.forEach) {
        ele.children.map(byId).forEach(c => {
          if (c) c.parent = ele.id;
        });
      }
    });
  },
};
