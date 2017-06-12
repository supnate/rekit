// Summary:
//   This is the entry of the application, works together with index.html.

import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import configStore from './common/configStore';
import routeConfig from './common/routeConfig';
import Root from './Root';

const store = configStore();

function renderApp(app) {
  render(
    <AppContainer>
      {app}
    </AppContainer>,
    document.getElementById('react-root')
  );
}

renderApp(<Root store={store} routeConfig={routeConfig} />);

// Hot Module Replacement API
/* istanbul ignore if  */
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default; // eslint-disable-line
    renderApp(<NextRoot store={store} routeConfig={routeConfig} />);
  });
}
