import {
  TEST_2_TEST_ACTION,
  AA_22,
} from './constants';

const initialState = {
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TEST_2_TEST_ACTION:
      return {
        ...state,
      };

    case AA_22:
      return {
        ...state,
      };

    default:
      return state;
  }
}

