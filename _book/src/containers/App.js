import React, { Component, PropTypes } from 'react';
import routeConfig from '../common/routeConfig';
import SimpleNav from '../components/SimpleNav';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="app">
        <h1>My Awesome Project!</h1>
        <SimpleNav routes={routeConfig} />
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
