import _ from 'lodash';
import { createSelector } from 'reselect';
import plugin from '../../plugin/plugin';
import { storage } from '../../common/utils';

const pathnameSelector = state => state.router.location.pathname;
const elementByIdSelector = state => state.home.elementById;
const openTabsSelector = state => state.home.openTabs;

let byId;

const getTreeNode = elementId => {
  const element = byId(elementId);
  return {
    ...element,
    key: elementId,
    children: element.children && element.children.map(child => getTreeNode(child)),
  };
};

export const tabsSelector = createSelector(
  pathnameSelector,
  elementByIdSelector,
  openTabsSelector,
  (pathname, elementById, openTabs) => {
    byId = id => elementById[id] || null;
    if (!elementById) {
      return {};
    }
    let tab;
    plugin
      .getPlugins()
      .reverse()
      .some(p => {
        if (p.tab && p.tab.getTab) {
          tab = p.tab.getTab(pathname);
        }
        return !!tab;
      });

    if (!tab) {
      tab = {
        name: 'Not found',
        key: 'rekit:not-found',
      };
    }
    return { openTabs: [tab] };

    // let { openTabs, historyTabs } = state;
    // if (!openTabs.includes(tab.key)) {
    //   openTabs = [...openTabs, tab.key];
    // }
    // historyTabs = [tab.key, _.without(historyTabs, tab.key)];
    // newState = { ...state, openTabs, historyTabs };
    // storage.session.setItem('openTabs', openTabs);
    // storage.session.setItem('historyTabs', historyTabs);
  }
);
