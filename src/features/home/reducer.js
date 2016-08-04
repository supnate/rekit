import {
  DEMO_COUNT,
  RESET_COUNT,
} from './constants';

const initialState = {
  count: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case DEMO_COUNT:
      return {
        ...state,
        count: state.count + 1,
      };

    case RESET_COUNT:
      return {
        ...state,
        count: 0,
      };

    default:
      return state;
  }
}
