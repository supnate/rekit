import _ from 'lodash';
import { matchPath } from 'react-router-dom';
import store from '../../../common/store';
// import history from '../../../common/history';

// const getTab = _.memoize((urlPath, elementById) => {

// }, (urlPath, elementById) => {
//   return urlPath;
// });

export default {
  getTab(urlPath) {
    const { elementById } = store.getState().home;

    if (!elementById) return null;

    let match;

    // Find element page
    match = matchPath(urlPath, {
      path: '/element/:elementId/:part?',
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
        subTabs:
          ele.parts &&
          ele.parts.map(part => ({
            isDefault: part.isDefault,
            name: _.capitalize(part.name),
            key: part.name,
            urlPath: `/element/${encodeURIComponent(ele.id)}/${encodeURIComponent(part.name)}`,
          })),
      };
      return tab;
    }

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

    // return getTab(urlPath, store.getState().home.elementById);
    // if (!pathname) pathname = document.location.pathname;
    // const arr = _.compact(urlPath.split('/')).map(decodeURIComponent);
    // let key = null;
    // if (arr.length === 0) {
    //   key = '#home';
    // } else if (arr[1] === 'routes') {
    //   key = `${arr[0]}/routes`;
    // } else if (arr[0] === 'element') {
    //   key = arr[1];
    // } else if (arr[0] === 'tools' && arr[1] === 'tests') {
    //   key = '#tests';
    // } else if (arr[0] === 'tools' && arr[1] === 'coverage') {
    //   key = '#coverage';
    // } else if (arr[0] === 'tools' && arr[1] === 'build') {
    //   key = '#build';
    // } else if (arr[0] === 'config' && arr[1] === 'deps') {
    //   key = '#deps';
    // }
    // return key;

    // const { elementById } = store.getState().home.projectData;
    // const ele = elementById[elementId];
    // switch (ele.type) {
    //   case 'component':
    //   case 'action':
    //   case 'initial-state':
    //     break;
    //   default:
    //     break;
    // }
    // return null;
  },
  tabToUrl() {},
};
