import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';

const rootReducer = combineReducers({ // REKIT_ARCHOR_DO_NOT_CHANGE
  routing: routerReducer,
  home: homeReducer,
  common: commonReducer,
}); // REKIT_ARCHOR_DO_NOT_CHANGE

export default rootReducer;
