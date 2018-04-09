import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Table, Spin } from 'antd';
import * as actions from './redux/actions';

export class DepsManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.config.deps || this.props.config.depsNeedReload) {
      this.props.actions.fetchDeps();
    }
  }

  getColumns() {
    return [
      {
        dataIndex: 'name',
        title: 'Name',
        render(name) {
          return (
            <a href={`https://www.npmjs.com/package/${name}`} target="_blank">
              {name}
            </a>
          );
        },
      },
      {
        dataIndex: 'requiredVersion',
        title: 'Required',
      },
      {
        dataIndex: 'installedVersion',
        title: 'Installed',
      },
      {
        dataIndex: 'latestVersion',
        title: 'Latest',
      },
      {
        dataIndex: 'status',
        title: 'Status',
      },
    ];
  }

  getData() {
    const { devDeps, allDeps, deps } = this.props.config.deps;
    return devDeps
      .map(name => ({
        name,
        requiredVersion: allDeps[name].requiredVersion,
        installedVersion: allDeps[name].installedVersion,
        latestVersion: allDeps[name].latestVersion,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  renderLoading() {
    return (
      <div className="config-deps-manager page-loading">
        <Spin /> Loading...
      </div>
    );
  }

  render() {
    if (this.props.config.fetchDepsPending || !this.props.config.deps) return this.renderLoading();
    return (
      <div className="config-deps-manager">
        <div className="toolbar">
          <Button type="primary">
            Install Dependency
          </Button>
        </div>
        <Table
          pagination={false}
          rowKey="name"
          bordered
          dataSource={this.getData()}
          columns={this.getColumns()}
          size="small"
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DepsManager);
