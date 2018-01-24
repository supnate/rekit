import _ from 'lodash';
import {
  HOME_OPEN_TAB,
} from './constants';

export function openTab(elementKey, tabType) {
  console.log('open tab: ', elementKey);
  return {
    type: HOME_OPEN_TAB,
    data: { file: elementKey, tabType }
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_OPEN_TAB: {
      let { openTabs, historyTabs } = state;
      const { file, tabType } = action.data;

      if (!_.find(openTabs, { file })) {
        const ele = state.elementById[file];
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
      } else if (historyTabs[0] !== file) {
        historyTabs = [file, ..._.without(historyTabs, file)]
        return {
          ...state,
          historyTabs,
        };
      }
      return state;
      
    }

    default:
      return state;
  }
}
