import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
} from './constants';

const initialState = {
  count: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    case COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    case RESET_COUNTER:
      return {
        ...state,
        count: 0,
      };

    default:
      return state;
  }
}
