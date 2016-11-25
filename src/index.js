import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import Root from './containers/Root';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configStore from './common/configStore';

const store = configStore();
const history = syncHistoryWithStore(browserHistory, store);

const root = document.getElementById('react-root');

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  root
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default; // eslint-disable-line
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      root
    );
  });
}
