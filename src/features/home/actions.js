import {
  DEMO_COUNT,
  RESET_COUNT,
} from './constants';

export function demoCount() {
  return {
    type: DEMO_COUNT,
  };
}

export function resetCount() {
  return {
    type: RESET_COUNT,
  };
}
