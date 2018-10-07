import { matchPath } from 'react-router-dom';
import store from '../../../common/store';

export default {
  getTab(urlPath) {
    const { elementById } = store.getState().home;

    if (!elementById) return null;

    let match;

    // Find element page
    match = matchPath(urlPath, {
      path: '/element/:elementId/:view?',
      exact: true,
    });
    if (match) {
      // it's an element
      const ele = elementById[decodeURIComponent(match.params.elementId)];
      if (!ele) return null;
      const tab = {
        name: ele.name,
        key: ele.id,
        urlPath,
        icon: ele.icon,
        iconColor: ele.tabIconColor || ele.iconColor,
        subTabs:
          ele.views &&
          ele.views.map(view => ({
            isDefault: view.isDefault,
            name: view.name,
            key: view.key,
            target: view.target,
            urlPath: `/element/${encodeURIComponent(ele.id)}/${encodeURIComponent(view.key)}`,
          })),
      };
      return tab;
    }

    if (urlPath === '/' || !urlPath) {
      return {
        name: 'Dashboard',
        key: 'dashboard',
        icon: 'dashboard',
        iconColor: '#33cdff',
        noPreview: true,
        urlPath,
      };
    }

    return null;
  },
};