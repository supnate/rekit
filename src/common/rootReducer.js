import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/reducer';
import test2Reducer from '../features/test-2/reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  home: homeReducer,
  test2: test2Reducer,
});

export default rootReducer;
