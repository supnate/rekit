import React, { Component, PropTypes } from 'react';
import Hello from '../components/Hello';
import routeConfig from '../common/routeConfig';
import SimpleNav from '../components/SimpleNav';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div>
        <Hello />
        <SimpleNav routes={routeConfig} />
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
