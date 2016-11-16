import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/redux/reducer';
import test1Reducer from '../features/test-1/redux/reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  home: homeReducer,
  test1: test1Reducer,
});

export default rootReducer;
