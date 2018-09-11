import _ from 'lodash';
import { matchPath } from 'react-router-dom';
import store from '../../../common/store';

export default {
  getTab(urlPath) {
    const { elementById } = store.getState().home;

    if (!elementById) return null;

    let match;
    // Find build page
    match = matchPath(urlPath, {
      path: '/tools/build',
      exact: true,
    });
    if (match) {
      return {
        name: 'Build',
        key: '#build',
      };
    }

    return null;
  },
};
