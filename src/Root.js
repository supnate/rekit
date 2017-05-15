import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routeConfig from './common/routeConfig';

function renderRouteConfigV3(Container, routes, contextPath = '/') {
  // Resolve route config object in React Router v3.

  const children = []; // children component list
  const renderRoute = (item) => {
    let newContextPath;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = contextPath + item.path;
    }
    if (item.component && item.childRoutes) {
      children.push(renderRouteConfigV3(item.component, item.childRoutes, newContextPath));
    } else if (item.component) {
      children.push(<Route key={newContextPath} component={item.component} path={newContextPath} exact />);
    } else if (item.childRoutes) {
      item.childRoutes.forEach(renderRoute);
    }
  };
  routes.forEach(renderRoute);

  // Use Switch as the default container by default
  if (!Container) return <Switch>{children}</Switch>;

  return (
    <Container key={contextPath}>
      <Switch>
      {children}
      </Switch>
    </Container>
  );
}

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
        {renderRouteConfigV3(null, routeConfig, '/')}
        </Router>
      </Provider>
    );
  }
}
