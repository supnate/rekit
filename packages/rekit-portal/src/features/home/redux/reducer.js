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

const reducers = [
  fetchProjectData,
  fetchFileContent,
  showDemoAlertReducer,
  hideDemoAlertReducer,
  saveFileReducer,
  closeTabReducer,
  moveTabReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    case 'PROJECT_FILE_CHANGED':
      newState = {
        ...state,
        projectDataNeedReload: true,
      };
      break;

    case '@@router/LOCATION_CHANGE': {
      // Open tab or switch tab type while url changes.
      const { pathname } = action.payload;
      const arr = _.compact(pathname.split('/')).map(decodeURIComponent);
      const { elementById } = state;
      let { openTabs, historyTabs } = state;

      if (arr[0] === 'element') {
        // This is an element page
        const file = arr[1];
        const tabType = arr[2] || 'code';
        const ele = elementById[file];
        if (!ele) return state; // Should only happens when after refreshing the page when project data is not fetched.

        const foundTab = _.find(openTabs, { file });
        if (!foundTab) {
          // If not find the tab, open it.
          const item = {
            ..._.pick(ele, ['file', 'name', 'type', 'feature']),
            tab: tabType,
          };
          openTabs = [...openTabs, item];
          historyTabs = [item.file, ...historyTabs];
          return {
            ...state,
            openTabs,
            historyTabs,
          };
        } else {
          // Tab already open
          if (foundTab.tab !== tabType) {
            // Tab type is changed.
            const index = _.findIndex(openTabs, { file });
            openTabs = update(openTabs, {
              [index]: { tab: { $set: tabType } }
            });
          }

          // Move the tab to top in history
          if (historyTabs[0] !== file) {
            historyTabs = [file, ..._.without(historyTabs, file)];
          }

          return {
            ...state,
            openTabs,
            historyTabs,
          };
        }
      }
      return state;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
