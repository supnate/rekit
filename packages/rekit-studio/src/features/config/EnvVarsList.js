import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'antd';

export default class EnvVarsList extends Component {
  static propTypes = {
    generalEnvVars: PropTypes.array.isRequired,
    localEnvVars: PropTypes.array.isRequired,
    env: PropTypes.string.isRequired,
  };

  getEnv() {
    const { env } = this.props;
    return `${env[0].toUpperCase()}${env.substr(1)}`;
  }

  getColumns() {
    return [
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'value',
        title: 'Value',
      },
    ];
  }

  render() {
    return (
      <div className="config-env-vars-list">
        <div className="toolbar no-top-margin">
          <h4>{this.getEnv()}</h4>
        </div>

        <h5>General</h5>
        <Table
          columns={this.getColumns()}
          dataSource={this.props.generalEnvVars}
          size="small"
          pagination={false}
          rowKey="name"
        />

        <br />

        <h5>Local</h5>
        <Table
          columns={this.getColumns()}
          dataSource={this.props.localEnvVars}
          size="small"
          pagination={false}
          rowKey="name"
        />
      </div>
    );
  }
}
