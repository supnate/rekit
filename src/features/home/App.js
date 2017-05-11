import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routeConfig from '../../common/routeConfig';
import SimpleNav from '../common/SimpleNav';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it according to the requirement of your app.
*/

function renderRouteConfigV3(container, routes, contextPath = '/') {
  // Resolve route config object in React Router v3.

  // const arr = [...routes];
  // const flatRoutes = [];
  // let item;
  // let contextPath = '';

  // const flatten = (items, contextPath) => {
  //   items.forEach(item => {
  //     let newContextPath = contextPath;
  //     if (/^\//.test(item.path)) {
  //       newContextPath = item.path;
  //     } else {
  //       newContextPath += item.path;
  //     }
  //     flatRoutes.push({ ...item, path: newContextPath });

  //     if (item.childRoutes) flatten(item.childRoutes, newContextPath);
  //   });
  // }
  // flatten(routes);

  const children = []; // children component list

  const renderRoute = (item) => { console.log('item:', item);
    let newContextPath;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = contextPath + item.path;
    }
    if (item.component && item.childRoutes) {
      children.push(renderRouteConfigV3(item.component, item.childRoutes, newContextPath));
    } else if (item.component) {
      children.push(<Route component={item.component} path={newContextPath} exact={!!item.exact} />);
    } else if (item.childRoutes) {
      item.childRoutes.forEach(renderRoute);
    }
  };

  routes.forEach(renderRoute);

  // const render = (item, routeProps) => {
  //   let newContextPath;
  //   if (/^\//.test(item.path)) {
  //     newContextPath = item.path;
  //   } else {
  //     newContextPath = contextPath + item.path;
  //   }
  //   console.log(item, newContextPath)

  //   return renderRouteConfigV3(item.component, item.childRoutes, newContextPath, routeProps)
  // };
  return (
    <container>
      {children}
    </container>
  );
  // console.log(routes);
  
  // console.log(flatRoutes);
  // return (
  //   <Switch>
  //     {flatRoutes.map((item, i) => (
  //       item.component && <Route path={item.path} key={i} component={item.component} />
  //     ))}
  //   </Switch>
  // );

  // return (

  //   <Route path="/" render={props => <div>abc</div>} />
  // );
}

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: 'No content.',
  };

  render() {
    return (
      <Router>
        <div className="home-app">
          <div className="sidebar">
            <SimpleNav routes={routeConfig} />
            <p className="memo">
              Above is a simple navigation tree for you to navigate between pages,
              it&apos;s generated from the route config so it will be auto updated
              when you add/remove features or pages.
            </p>
          </div>
          <div className="page-container">
            {renderRouteConfigV3(Switch, routeConfig, '/')}
          </div>
        </div>
      </Router>
    );
  }
}
