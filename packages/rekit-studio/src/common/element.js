import _ from 'lodash';
import history from './history';
import store from './store';

const byId = id => store.getState().home.elementById[id];
export default {
  show(ele, view) {
    if (_.isString(ele)) {
      ele = byId(ele);
    }
    if (!ele) {
      console.error('Element does not exist: ', arguments[0]);
      return;
    }
    const pathname = store.getState().router.location.pathname;

    let url;
    if (view) {
      // caller is repsonsible to ensure ele has view
      // if (!this.hasViews(ele)) throw new Error(`Element "${ele.id}" does not has view "${view}".`);
      url = `/element/${encodeURIComponent(ele.id)}/${view}`;
    } else if (ele.owner || !ele.views) {
      // show a concrete file
      url = this.getUrl(ele);
    } else {
      // It's an virtual element, like component/action/page etc.
      const openTabs = store.getState().home.openTabs;
      const foundTab = _.find(openTabs, { key: ele.id });

      if (foundTab) {
        url = foundTab.urlPath;
      } else {
        url = this.getUrl(ele);
      }
    }
    if (url === pathname) return 0;
    history.push(url);
    return 1;
  },

  getUrl(ele) {
    let originalEle = ele;
    if (_.isString(ele)) ele = byId(ele);
    if (!ele) {
      console.error('Can not find element: ', originalEle);
      return null;
    }
    originalEle = ele;
    if (ele.owner) ele = byId(ele.owner);

    const url = `/element/${encodeURIComponent(ele.id)}`;

    const view = originalEle === ele ? this.getDefaultView(ele) : this.getView(ele, originalEle.id);
    if (view) return `${url}/${view.key}`;

    return url;
  },

  hasViews(ele) {
    if (_.isString(ele)) ele = byId(ele);
    return ele.views && ele.views.length;
  },

  getDefaultView(ele) {
    if (!this.hasViews(ele)) return null;
    if (_.isString(ele)) ele = byId(ele);
    return _.find(ele.views, 'isDefault') || ele.views[0];
  },

  getView(ele, target) {
    if (!this.hasViews(ele)) return null;
    if (_.isString(ele)) ele = byId(ele);
    return _.find(ele.views, { target });
  },
};
