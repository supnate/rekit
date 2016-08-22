import {
  RESET_COUNTER,
  COUNTER_MINUS_ONE,
  COUNTER_PLUS_ONE,
} from './constants';

export function resetCount() {
  return {
    type: RESET_COUNTER,
  };
}

export function counterMinusOne() {
  return {
    type: COUNTER_MINUS_ONE,
  };
}

export function counterPlusOne() {
  return {
    type: COUNTER_PLUS_ONE,
  };
}
