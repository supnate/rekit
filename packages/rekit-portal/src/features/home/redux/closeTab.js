import _ from 'lodash';
import update from 'immutability-helper';
import {
  HOME_CLOSE_TAB,
} from './constants';

export function closeTab(key) {
  return {
    type: HOME_CLOSE_TAB,
    data: { key },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CLOSE_TAB: {
      const toClose = { key: action.data.key };
      const index1 = _.findIndex(state.openTabs, toClose);
      const index2 = _.indexOf(state.historyTabs, toClose.key);

      return update(state, {
        openTabs: { $splice: [[index1, 1]] },
        historyTabs: { $splice: [[index2, 1]] },
      });
    }

    default:
      return state;
  }
}
