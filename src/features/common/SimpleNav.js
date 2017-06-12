/*
 * This is a very simple navigation tree for testing purpose.
 * It groups URLs by features.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class SimpleNav extends PureComponent {
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  renderLinks(items, basePath) {
    return (
      <ul>
        {items.reduce((prev, item) => {
          if (item.autoIndexRoute) return prev;
          let path;
          if (/^\//.test(item.path)) {
            path = item.path;
          } else if (basePath === '/') {
            path = `/${item.path}`;
          } else {
            path = `${basePath}/${item.path}`;
          }
          prev.push(<li key={path}><Link to={path}>{item.name || item.path}</Link></li>);

          if (item.childRoutes && item.childRoutes.length) {
            prev.push(<li key={`${path}_wrapper`}>{this.renderLinks(item.childRoutes, path)}</li>);
          }
          return prev;
        }, [])}
      </ul>
    );
  }

  render() {
    return (
      <div className="common-simple-nav">
        {this.renderLinks(this.props.routes[0].childRoutes, '')}
      </div>
    );
  }
}
