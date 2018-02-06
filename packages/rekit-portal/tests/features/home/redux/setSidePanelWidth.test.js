import { expect } from 'chai';

import {
  HOME_SET_SIDE_PANEL_WIDTH,
} from 'src/features/home/redux/constants';

import {
  setSidePanelWidth,
  reducer,
} from 'src/features/home/redux/setSidePanelWidth';

describe('home/redux/setSidePanelWidth', () => {
  it('returns correct action by setSidePanelWidth', () => {
    expect(setSidePanelWidth()).to.have.property('type', HOME_SET_SIDE_PANEL_WIDTH);
  });

  it('handles action type HOME_SET_SIDE_PANEL_WIDTH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_SIDE_PANEL_WIDTH }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
