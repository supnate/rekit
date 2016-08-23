import {
  COUNTER_PLUS_ONE,
  COUNTER_MINUS_ONE,
  RESET_COUNTER,
} from './constants';

export function counterPlusOne() {
  return {
    type: COUNTER_PLUS_ONE,
  };
}

export function counterMinusOne() {
  return {
    type: COUNTER_MINUS_ONE,
  };
}

export function resetCount() {
  return {
    type: RESET_COUNTER,
  };
}
