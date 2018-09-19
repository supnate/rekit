import _ from 'lodash';
import history from './history';
import store from './store';

const byId = id => store.getState().home.elementById[id];
export default {
  show(ele) {
    const t = ele;
    if (_.isString(ele)) ele = byId(ele);
    if (!ele) {
      console.error('Element does not exist: ', t);
      return;
    }

    const openTabs = store.getState().home.openTabs;
    const pathname = store.getState().router.location.pathname;
    const target = `/element/${encodeURIComponent(ele.id)}`;
    if (pathname === target) return 0;
    console.log(openTabs);
    history.push(target);
    return 1;
  },
}
