import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const middlewares = [thunk];
let devToolsExtension = f => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'dev') {
  const createLogger = require('redux-logger');

  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  if (window.devToolsExtension) {
    devToolsExtension = window.devToolsExtension();
  }
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    devToolsExtension
  ));

  // TODO: reducers hot module replacement
  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextReducer = require('../reducers');
  //     store.replaceReducer(nextReducer);
  //   });
  // }

  return store;
}
