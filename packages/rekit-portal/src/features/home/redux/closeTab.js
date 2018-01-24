import _ from 'lodash';
import update from 'immutability-helper';
import {
  HOME_CLOSE_TAB,
} from './constants';

export function closeTab(file) {
  return {
    type: HOME_CLOSE_TAB,
    data: { file },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CLOSE_TAB: {
      const toClose = { file: action.data.file };
      const index1 = _.findIndex(state.openTabs, toClose);
      const index2 = _.indexOf(state.historyTabs, toClose.file);

      return update(state, {
        openTabs: { $splice: [[index1, 1]] },
        historyTabs: { $splice: [[index2, 1]] },
      });
    }

    default:
      return state;
  }
}
