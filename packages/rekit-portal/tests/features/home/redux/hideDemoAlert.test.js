import { expect } from 'chai';

import {
  HOME_HIDE_DEMO_ALERT,
} from 'src/features/home/redux/constants';

import {
  hideDemoAlert,
  reducer,
} from 'src/features/home/redux/hideDemoAlert';

describe('home/redux/hideDemoAlert', () => {
  it('returns correct action by hideDemoAlert', () => {
    expect(hideDemoAlert()).to.have.property('type', HOME_HIDE_DEMO_ALERT);
  });

  it('handles action type HOME_HIDE_DEMO_ALERT correctly', () => {
    const prevState = { demoAlertVisible: true };
    const state = reducer(
      prevState,
      { type: HOME_HIDE_DEMO_ALERT }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal({ demoAlertVisible: false }); // TODO: replace this line with real case.
  });
});
