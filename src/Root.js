import React from 'react';
import { Provider } from 'react-redux';
import { App } from './features/home';
// import { Router } from 'react-router';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import routeConfig from './common/routeConfig';

// Math.random is a workaround for routing config hot reload.
// https://github.com/ReactTraining/react-router/issues/2704

function resolveRouteConfigV3(routes) {
  // Resolve route config object in React Router v3.
  console.log(routes);
  const arr = [...routes];
  const flatRoutes = [];
  let item;
  let contextPath = '';

  const flatten = (items, contextPath) => {
    items.forEach(item => {
      let newContextPath = contextPath;
      if (/^\//.test(item.path)) {
        newContextPath = item.path;
      } else {
        newContextPath += item.path;
      }
      flatRoutes.push({ ...item, path: newContextPath });

      if (item.childRoutes) flatten(item.childRoutes, newContextPath);
    });
  }
  flatten(routes);
  console.log(flatRoutes);
  return (
    <Switch>
      {flatRoutes.map((item, i) => (
        console.log(item.path) || <Route path={item.path} key={i} component={item.component} />
      ))}
    </Switch>
  );

  return (

    <Route path="/" render={props => <div>abc</div>} />
  );
}

export default class Root extends React.Component {
  render() {
    const { store, history } = this.props; // eslint-disable-line
    // if (!this.routeConfig) this.routeConfig = routeConfig;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
        // <Router history={history} routes={this.routeConfig} />
