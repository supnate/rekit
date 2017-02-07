import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routeConfig from './common/routeConfig';

// Math.random is a workaround for routing config hot reload.
// https://github.com/ReactTraining/react-router/issues/2704

export default class Root extends React.Component {
  render() {
    const { store, history } = this.props; // eslint-disable-line
    if (!this.routeConfig) this.routeConfig = routeConfig;
    return (
      <Provider store={store}>
        <Router history={history} routes={this.routeConfig} />
      </Provider>
    );
  }
}
