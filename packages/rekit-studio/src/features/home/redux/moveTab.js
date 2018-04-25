import { storage } from '../../common/utils';
import { HOME_MOVE_TAB } from './constants';

export function moveTab(args) {
  return {
    type: HOME_MOVE_TAB,
    data: args,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_MOVE_TAB: {
      // const index1 = _.findIndex(state.openTabs, toClose);
      const newOpenTabs = [...state.openTabs];
      const item = newOpenTabs[action.data.source.index];
      newOpenTabs.splice(action.data.source.index, 1);
      newOpenTabs.splice(action.data.destination.index, 0, item);
      storage.session.setItem('openTabs', newOpenTabs);
      return {
        ...state,
        openTabs: newOpenTabs,
      };
    }

    default:
      return state;
  }
}
