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
};

export default {
  processProjectData(prjData) {
    const byId = id => prjData.elementById[id];
    Object.values(prjData.elementById).forEach(ele => {
      if (ele.type && iconMap[ele.type]) {
        ele.icon = iconMap[ele.type];
        ele.iconColor = colorMap[ele.type];
      }

      if (ele.type === 'file') {
        switch (ele.ext) {
          case 'js':
          case 'svg':
          case 'less':
            ele.icon = `file_type_${ele.ext}`;
            break;
          default:
            break;
        }
      }

      if (ele.type === 'components') {
        ele.count = ele.children.length;
      }
      if (ele.type === 'actions') {
        ele.count = ele.children.length - 1;
      }

      if (ele.children && ele.children.forEach) {
        ele.children.map(byId).forEach(c => {
          if (c) c.parent = ele.id;
        });
      }
    });
  },
};
