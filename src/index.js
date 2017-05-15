// Summary:
//   This is the entry of the application, works together with index.html.

import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import configStore from './common/configStore';
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

renderApp(<Root store={store} />);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default; // eslint-disable-line
    renderApp(<NextRoot store={store} />);
  });
}
