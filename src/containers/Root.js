import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routeConfig from '../common/routeConfig';

// NOTE: 'this.routeConfig' is my workaround to dismiss 'You cannot change <Router routes>' warning.
// See: https://github.com/gaearon/react-hot-loader/issues/298

export default class Root extends React.Component {
  render() {
    const { store, history } = this.props; // eslint-disable-line
    /* istanbul ignore next  */
    if (!this.routeConfig) this.routeConfig = routeConfig;

    return (
      <Provider store={store}>
        <Router history={history} routes={this.routeConfig} />
      </Provider>
    );
  }
}
