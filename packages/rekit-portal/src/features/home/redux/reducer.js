import initialState from './initialState';
import { reducer as fetchProjectData } from './fetchProjectData';
import { reducer as fetchFileContent } from './fetchFileContent';
import { reducer as showDemoAlertReducer } from './showDemoAlert';
import { reducer as hideDemoAlertReducer } from './hideDemoAlert';
import { reducer as saveFileReducer } from './saveFile';
import { reducer as closeTabReducer } from './closeTab';
import { reducer as openTabReducer } from './openTab';
import { reducer as moveTabReducer } from './moveTab';
import { reducer as switchTypeTabReducer } from './switchTypeTab';

const reducers = [
  fetchProjectData,
  fetchFileContent,
  showDemoAlertReducer,
  hideDemoAlertReducer,
  saveFileReducer,
  closeTabReducer,
  openTabReducer,
  moveTabReducer,
  switchTypeTabReducer,
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
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
