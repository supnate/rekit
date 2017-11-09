import {
  HOME_SHOW_DEMO_ALERT,
} from './constants';

export function showDemoAlert() {
  return {
    type: HOME_SHOW_DEMO_ALERT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SHOW_DEMO_ALERT:
      return {
        ...state,
        demoAlertVisible: true,
      };

    default:
      return state;
  }
}
