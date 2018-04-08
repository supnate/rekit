import _ from 'lodash';
import update from 'immutability-helper';
import initialState from './initialState';
import { reducer as fetchProjectData } from './fetchProjectData';
import { reducer as fetchFileContent } from './fetchFileContent';
import { reducer as showDemoAlertReducer } from './showDemoAlert';
import { reducer as hideDemoAlertReducer } from './hideDemoAlert';
import { reducer as saveFileReducer } from './saveFile';
import { reducer as closeTabReducer } from './closeTab';
import { reducer as moveTabReducer } from './moveTab';
import { reducer as setSidePanelWidthReducer } from './setSidePanelWidth';
import { REKIT_CMDS_EXEC_CMD_SUCCESS } from '../../rekit-cmds/redux/constants';
import { reducer as codeChangeReducer } from './codeChange';
import { reducer as setOutlineWidthReducer } from './setOutlineWidth';

const reducers = [
  fetchProjectData,
  fetchFileContent,
  showDemoAlertReducer,
  hideDemoAlertReducer,
  saveFileReducer,
  closeTabReducer,
  moveTabReducer,
  setSidePanelWidthReducer,
  codeChangeReducer,
  setOutlineWidthReducer,
];

const pascalCase = _.flow(_.camelCase, _.upperFirst);


export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    case 'PROJECT_FILE_CHANGED':
    case REKIT_CMDS_EXEC_CMD_SUCCESS: // For quick project reoload.
      newState = {
        ...state,
        projectDataNeedReload: true,
      };
      break;

    case '@@router/LOCATION_CHANGE': {
      // Open tab or switch tab type while url changes.
      const { pathname } = action.payload;
      const arr = _.compact(pathname.split('/')).map(decodeURIComponent);
      let { openTabs, historyTabs } = state;
      let key, type, name, icon, feature; // eslint-disable-line

      if (arr.length === 0) {
        key = '#home';
        type = 'home';
        name = 'Dashboard';
        icon = 'home';
      } else if (arr[1] === 'routes') {
        key = `${arr[0]}/routes`;
        type = 'routes';
        name = _.capitalize(arr[0]);
        icon = 'share-alt';
      } else if (arr[0] === 'element') {
        key = arr[1];
        const ele = state.elementById[key];
        if (!ele) {
          newState = state; // Should only happens when after refreshing the page when project data is not fetched.
          break;
        }
        type = 'element';
        name = ele.name;
        feature = ele.feature;
        icon =
          {
            component: 'appstore-o',
            action: 'notification',
            misc: 'file',
          }[ele.type] || 'file';
        if (ele.name === 'route.js') {
          icon = 'share-alt';
          name = pascalCase(ele.feature);
        }
      } else if (arr[0] === 'tools' && arr[1] === 'tests') {
        key = '#tests';
        name = 'Run Tests';
        type = 'tests';
        icon = 'check-circle-o';
      } else if (arr[0] === 'tools' && arr[1] === 'coverage') {
        key = '#coverage';
        name = 'Test Coverage';
        type = 'coverage';
        icon = 'pie-chart';
      } else if (arr[0] === 'tools' && arr[1] === 'build') {
        key = '#build';
        name = 'Build';
        type = 'build';
        icon = 'play-circle-o';
      } else if (arr[0] === 'config' && arr[1] === 'deps') {
        key = '#deps';
        name = 'Dependencies';
        type = 'deps';
        icon = 'profile';
      } else {
        // No tabs for other pages like '/blank'
        newState = state;
        break;
      }

      const foundTab = _.find(openTabs, { key });
      if (!foundTab) {
        const tabItem = { key, type, name, icon, pathname };
        if (type === 'element') {
          tabItem.subTab = arr[2] || '';
          tabItem.feature = feature;
        }
        openTabs = [...openTabs, tabItem];
        historyTabs = [key, ...historyTabs];
      } else {
        // Tab has been open, move it to top of history
        historyTabs = [key, ..._.without(historyTabs, key)];

        if (type === 'element') {
          const subTab = arr[2] || '';
          // Check sub tab change for element page
          if (foundTab.subTab !== subTab) {
            // Tab type is changed.
            const index = _.findIndex(openTabs, { key });
            openTabs = update(openTabs, {
              [index]: { subTab: { $set: subTab } },
            });
          }
        }

        if (type === 'tests' && foundTab.pathname !== pathname) {
          const index = _.findIndex(openTabs, { key });
          openTabs = update(openTabs, {
            [index]: { pathname: { $set: pathname } },
          });
        }
      }
      newState = { ...state, openTabs, historyTabs };
      sessionStorage.setItem('openTabs', JSON.stringify(openTabs));
      sessionStorage.setItem('historyTabs', JSON.stringify(historyTabs));
      break;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
