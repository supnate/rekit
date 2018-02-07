import {
  HOME_HIDE_DEMO_ALERT,
} from './constants';

export function hideDemoAlert() {
  return {
    type: HOME_HIDE_DEMO_ALERT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_HIDE_DEMO_ALERT:
      return {
        ...state,
        demoAlertVisible: false,
      };

    default:
      return state;
  }
}
