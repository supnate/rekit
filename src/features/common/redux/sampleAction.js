import {
  SAMPLE_ACTION,
} from './constants';

export function sampleAction() {
  return {
    type: SAMPLE_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAMPLE_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
