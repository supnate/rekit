// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import update from 'immutability-helper';
import { HOME_STICK_TAB } from './constants';
import { getTabKey } from '../helpers';
import { storage } from '../../common/utils';

export function stickTab(key) {
  return {
    type: HOME_STICK_TAB,
    data: { key },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_STICK_TAB: {
      let openTabs = state.openTabs;
      const key = action.data.key || getTabKey();
      const tempTab = _.find(openTabs, { key, isTemp: true });
      if (tempTab) {
        const sticked = update(tempTab, { $unset: ['isTemp'] });
        const index = openTabs.indexOf(tempTab);
        openTabs = update(openTabs, { [index]: { $set: sticked } });
        storage.session.setItem('openTabs', openTabs);
        return {
          ...state,
          openTabs,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
