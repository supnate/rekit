import _ from 'lodash';
import history from './history';
import store from './store';

const byId = id => store.getState().home.elementById[id];
export default {
  show(ele, view) {
    let originalEle = ele;
    if (_.isString(ele)) {
      ele = byId(ele);
    }
    if (!ele) {
      console.error('Element does not exist: ', originalEle);
      return;
    } else {
      originalEle = ele;
    }
    const pathname = store.getState().router.location.pathname;
    let targetPathname;

    if (view) {
      targetPathname = `/element/${encodeURIComponent(ele.id)}/${view}`;
      if (pathname === targetPathname) return 0;
      history.push(targetPathname);
      return 1;
    }

    if (ele.owner) ele = byId(ele.owner);
    if (ele.target) ele = byId(ele.target);

    const openTabs = store.getState().home.openTabs;
    const foundTab = _.find(openTabs, { key: ele.id });

    if (foundTab) {
      if (foundTab.urlPath === pathname) {
        return 0;
      } else if (originalEle.id === ele.id) {
        targetPathname = foundTab.urlPath;
      } else {
        foundTab.subTabs &&
          foundTab.subTabs.some(t => {
            if (t.target === originalEle.id) {
              targetPathname = t.urlPath;
              return true;
            }
            return false;
          });
        if (!targetPathname) {
          console.error('target sub tab does not exist: ' + originalEle.id);
          return 0;
          // throw new Error('target sub tab does not exist: ' + originalEle.id);
        }
      }
    } else {
      targetPathname = `/element/${encodeURIComponent(ele.id)}`;
      if (ele.views) {
        let v = _.find(ele.views, { isDefault: true });
        if (!v) {
          v = ele.views[0];
        }
        targetPathname += `/${v.key}`;
      }
    }

    history.push(targetPathname);
    return 1;
  },
};
