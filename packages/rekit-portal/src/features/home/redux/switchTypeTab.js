import _ from 'lodash';
import update from 'immutability-helper';
import {
  HOME_SWITCH_TYPE_TAB,
} from './constants';

export function switchTypeTab(file, tabType) {
  console.log('switch type tab:', file, tabType);
  return {
    type: HOME_SWITCH_TYPE_TAB,
    data: { file, tabType },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SWITCH_TYPE_TAB: {
      const { file, tabType } = action.data;
      const index = _.findIndex(state.openTabs, { file });
      return update(state, {
        openTabs: {
          [index]: { tab: { $set: tabType } } 
        },
      });
    }

    default:
      return state;
  }
}
