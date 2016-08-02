/*
  This is a very simple navigation tree designed for test purpose.
*/
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class SimpleNav extends Component {
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  renderLinks(items, basePath) {
    return (
      <ul>
        {
          items.reduce((prev, item) => {
            let path;
            if (/^\//.test(item.path)) {
              path = item.path;
            } else if (basePath === '/') {
              path = `/${item.path}`;
            } else {
              path = `${basePath}/${item.path}`;
            }
            prev.push(<li key={path}><Link to={path}>{item.path === '/' ? 'root' : item.path}</Link></li>);

            if (item.childRoutes && item.childRoutes.length) {
              prev.push(<li key={`${path}_wrapper`}>{this.renderLinks(item.childRoutes, path)}</li>);
            }
            return prev;
          }, [])
        }
      </ul>
    );
  }

  render() {
    return this.renderLinks(this.props.routes, '');
  }
}
