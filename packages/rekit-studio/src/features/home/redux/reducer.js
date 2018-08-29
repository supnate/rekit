import _ from 'lodash';
import update from 'immutability-helper';
import history from '../../../common/history';
import initialState from './initialState';
import { reducer as fetchProjectData } from './fetchProjectData';
import { reducer as fetchFileContent } from './fetchFileContent';
import { reducer as showDemoAlertReducer } from './showDemoAlert';
import { reducer as hideDemoAlertReducer } from './hideDemoAlert';
import { reducer as saveFileReducer } from './saveFile';
import { reducer as closeTabReducer } from './closeTab';
import { reducer as moveTabReducer } from './moveTab';
import { REKIT_CMDS_EXEC_CMD_SUCCESS } from '../../rekit-cmds/redux/constants';
import { reducer as codeChangeReducer } from './codeChange';
import { reducer as stickTabReducer } from './stickTab';
import { getTabKey } from '../helpers';
import { storage } from '../../common/utils';
import { reducer as updateProjectDataReducer } from './updateProjectData';
import { reducer as showDialogReducer } from './showDialog';
import { reducer as hideDialogReducer } from './hideDialog';
import plugin from '../../plugin/plugin';
import { reducer as setViewChangedReducer } from './setViewChanged';
import { reducer as resizePaneReducer } from './resizePane';

const reducers = [
  fetchProjectData,
  fetchFileContent,
  showDemoAlertReducer,
  hideDemoAlertReducer,
  saveFileReducer,
  closeTabReducer,
  moveTabReducer,
  codeChangeReducer,
  stickTabReducer,
  updateProjectDataReducer,
  showDialogReducer,
  hideDialogReducer,
  setViewChangedReducer,
  resizePaneReducer,
];

// const pascalCase = _.flow(
//   _.camelCase,
//   _.upperFirst
// );

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    case 'PROJECT_DATA_CHANGED':
    case REKIT_CMDS_EXEC_CMD_SUCCESS: // For quick project reoload.
      newState = {
        ...state,
        projectDataNeedReload: true,
      };
      break;

    case '@@router/LOCATION_CHANGE': {
      // Open tab or switch tab type while url changes.
      const pathname = action.payload.pathname;
      if (!state.elementById) {
        newState = state;
        break;
      }
      let tab;
      plugin
        .getPlugins()
        .reverse()
        .some(p => {
          if (p.tab && p.tab.getTab) {
            tab = { ...p.tab.getTab(pathname) };
          }
          return !!tab;
        });

      if (!tab) {
        tab = {
          name: 'Not found',
          key: 'rekit:not-found',
        };
      }
      tab.isTemp = !tab.noPreview;

      let { openTabs, historyTabs } = state;
      openTabs = openTabs.map(t => ({ ...t, isActive: false }));

      let foundTab = _.find(openTabs, { key: tab.key });
      if (!foundTab) {
        if (tab.isTemp) {
          const currentTemp = _.find(openTabs, 'isTemp');
          if (currentTemp) {
            openTabs = _.filter(openTabs, t => !t.isTemp);
            historyTabs = _.without(historyTabs, currentTemp.key);
          }
        }

        tab.urlPath = pathname;
        tab.isActive = true;

        openTabs = [...openTabs, tab];
        foundTab = tab;
      } else {
        foundTab = { ...tab, isTemp: foundTab.isTemp };
      }

      // If current url path doesn't match urlPath of element which has sub tabs,
      // redirect to the default/current url path of the element.
      if (foundTab.subTabs && foundTab.subTabs.length && !foundTab.subTabs.some(t => t.urlPath === pathname)) {
        let redirectUrlPath;
        if (foundTab.subTabs.some(t => t.urlPath === foundTab.urlPath)) redirectUrlPath = foundTab.urlPath;
        else redirectUrlPath = (_.find(foundTab.subTabs, 'isDefault') || foundTab.subTabs[0]).urlPath;
        requestAnimationFrame(() => history.replace(redirectUrlPath));
        newState = state;
        break;
      }

      const foundIndex = _.findIndex(openTabs, { key: foundTab.key });
      openTabs = update(openTabs, { [foundIndex]: { $set: { ...foundTab, urlPath: pathname, isActive: true } } });
      historyTabs = [tab.key, ..._.without(historyTabs, tab.key)];
      newState = { ...state, openTabs, historyTabs };
      storage.session.setItem('openTabs', openTabs);
      storage.session.setItem('historyTabs', historyTabs);
      break;
    }

    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
