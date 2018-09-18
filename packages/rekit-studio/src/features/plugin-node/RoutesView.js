import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Table } from 'antd';
import { Link } from 'react-router-dom';
import { SvgIcon } from '../common';
import history from '../../common/history';

export class RoutesView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
  };

  getColumns() {
    return [
      {
        dataIndex: 'method',
        title: 'Method',
        width: 80,
      },
      {
        dataIndex: 'path',
        title: 'Path',
        render: path => (
          <a href={`http://localhost:8080${path}`} target="_blank">
            {path}
          </a>
        ),
      },
      {
        dataIndex: 'target',
        title: 'Target',
        width: 360,
        render: target => {
          const ele = this.props.elementById[`v:${target}`];
          if (!ele) {
            return `Target not found: ${target}`;
          }
          return (
            <Link to={`/element/${encodeURIComponent(ele.id)}`}>
              <SvgIcon type={ele.icon} style={{ fill: ele.tabIconColor}}/> {ele.name}
            </Link>
          );
        },
      },
    ];
  }

  render() {
    return (
      <div className="plugin-node-routes-view">
        <Table
          columns={this.getColumns()}
          dataSource={this.props.routes}
          size="small"
          pagination={false}
          rowKey="path"
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    routes: state.home.routes,
    elementById: state.home.elementById,
  };
}

export default connect(mapStateToProps)(RoutesView);
