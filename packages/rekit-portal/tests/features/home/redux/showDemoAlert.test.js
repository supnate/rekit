import { expect } from 'chai';

import {
  HOME_SHOW_DEMO_ALERT,
} from 'src/features/home/redux/constants';

import {
  showDemoAlert,
  reducer,
} from 'src/features/home/redux/showDemoAlert';

describe('home/redux/showDemoAlert', () => {
  it('returns correct action by showDemoAlert', () => {
    expect(showDemoAlert()).to.have.property('type', HOME_SHOW_DEMO_ALERT);
  });

  it('handles action type HOME_SHOW_DEMO_ALERT correctly', () => {
    const prevState = { demoAlertVisible: false };
    const state = reducer(
      prevState,
      { type: HOME_SHOW_DEMO_ALERT }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal({ demoAlertVisible: true });
  });
});
