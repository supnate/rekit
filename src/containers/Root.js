import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routeConfig from '../common/routeConfig';

// NOTE: key=Math.random is a workaround to dismiss 'You cannot change <Router routes>' warning.
// See: https://github.com/gaearon/react-hot-loader/issues/298

export default class Root extends React.Component {
  render() {
    const { store, history } = this.props; // eslint-disable-line
    return (
      <Provider key={Math.random()} store={store}>
        <Router history={history} routes={routeConfig} />
      </Provider>
    );
  }
}
