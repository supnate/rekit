import _ from 'lodash';
import initialState from './initialState';
import { reducer as runBuildReducer } from './runBuild';
import { reducer as runTestReducer } from './runTest';
import { reducer as clearTestOutputReducer } from './clearTestOutput';
import { HOME_FETCH_PROJECT_DATA_SUCCESS } from '../../home/redux/constants';
import { reducer as checkTestCoverageReducer } from './checkTestCoverage';

const reducers = [
  runBuildReducer,
  runTestReducer,
  clearTestOutputReducer,
  checkTestCoverageReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case HOME_FETCH_PROJECT_DATA_SUCCESS:
      newState = {
        ...state,
        runBuildRunning: !!_.get(action.data, 'bgProcesses.runningBuild'),
        runTestRunning: !!_.get(action.data, 'bgProcesses.runningTest'),
      };
      break;
    case 'REKIT_STUDIO_OUTPUT':
      if (action.data.type === 'build') {
        newState = {
          ...state,
          runBuildOutput: [...state.runBuildOutput || [], ...action.data.output],
        };
      } else if (action.data.type === 'test') {
        return {
          ...state,
          runTestOutput: [...state.runTestOutput || [], ...action.data.output],
        };
      } else {
        newState = state;
      }
      break;
    case 'REKIT_TOOLS_BUILD_FINISHED':
      newState = {
        ...state,
        runBuildRunning: false,
      };
      break;
    case 'REKIT_TOOLS_TEST_FINISHED':
      newState = {
        ...state,
        runTestRunning: false,
      };
      break;
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
