import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/reducer';
import test1Reducer from '../features/test-1/reducer';
import test2Reducer from '../features/test-2/reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  home: homeReducer,
  test1: test1Reducer,
  test2: test2Reducer,
});

export default rootReducer;
