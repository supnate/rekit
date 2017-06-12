import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleNav from '../common/SimpleNav';
import routeConfig from '../../common/routeConfig';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it according to the requirement of your app.
*/
export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: 'No content.',
  };

  render() {
    return (
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
          {this.props.children}
        </div>
      </div>
    );
  }
}
