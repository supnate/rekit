import {
  RESET_COUNTER,
  COUNTER_MINUS_ONE,
  COUNTER_PLUS_ONE,
} from './constants';

const initialState = {
  count: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case RESET_COUNTER:
      return {
        ...state,
        count: 0,
      };

    case COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
