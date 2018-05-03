import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon, Input, Table, Spin, Menu, Modal } from 'antd';
import * as actions from './redux/actions';

export class DepsList extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    deps: PropTypes.array.isRequired,
    depsType: PropTypes.string.isRequired,
    bgProcesses: PropTypes.object.isRequired,
  };

  state = {
    statusFilter: [],
    statusFilterDropdownVisible: false,
    inputValue: '',
  };

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
        width: 110,
      },
      {
        dataIndex: 'installedVersion',
        title: 'Installed',
        width: 110,
      },
      {
        dataIndex: 'status',
        title: 'Latest',
        width: 140,
        filterDropdown: (
          <div className="status-filter">
            <Menu
              className="status-filter-menu"
              selectedKeys={this.state.statusFilter}
              multiple
              onSelect={this.handleStatusFilter}
              onDeselect={this.handleStatusFilter}
            >
              <Menu.Item key="null">
                <span className="status-icon status-icon-null" /> Up to date
              </Menu.Item>
              <Menu.Item key="patch">
                <span className="status-icon status-icon-patch" /> Patch update
              </Menu.Item>
              <Menu.Item key="minor">
                <span className="status-icon status-icon-minor" /> Minor update
              </Menu.Item>
              <Menu.Item key="major">
                <span className="status-icon status-icon-major" /> Major update
              </Menu.Item>
            </Menu>
            <div className="filter-footer">
              <Button size="small" type="primary" onClick={this.handleApplyStatusFilter}>
                Ok
              </Button>
              <Button size="small" onClick={this.handleResetStatusFilter}>
                Reset
              </Button>
            </div>
          </div>
        ),
        filterIcon: <Icon type="filter" style={{ color: this.state.statusFilter.length ? '#03a9f4' : '#aaa' }} />,
        filterDropdownVisible: this.state.statusFilterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState({
            statusFilterDropdownVisible: visible,
          });
        },
        render(status, record) {
          return (
            <span className={`status-${record.status}`}>
              {status ? <span className={`status-icon status-icon-${status}`} title={`${status}`} /> : ''}
              {' '}{record.latestVersion}
            </span>
          );
        },
      },
      {
        dataIndex: 'action',
        title: 'Action',
        width: 100,
        align: 'center',
        render: (__, item) => {
          return (
            <div className="actions">
              <Icon type="arrow-up" title="Upgrade" onClick={() => this.handleUpdatePackage(item.name)} />
              <Icon type="close" title="Remove" onClick={() => this.handleRemovePackage(item.name)} />
            </div>
          );
        },
      },
    ];
  }

  getData() {
    return this.props.deps.filter(d => !this.state.statusFilter.length || this.state.statusFilter.includes(d.status));
  }

  handleInputChange = evt => {
    this.setState({ inputValue: evt.target.value });
  };

  handleAddPackage = () => {
    if (!this.state.inputValue) return;
    this.props.actions.installPackage(this.state.inputValue);
  };

  handleUpdatePackage = name => {
    if (this.props.bgProcesses.updatePackagePending) return;
    this.props.actions.updatePackage(name);
  };
  handleRemovePackage = name => {
    if (this.props.bgProcesses.removePackagePending) return;
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure to remove the package?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        this.props.actions.removePackage(name);
      },
    });
  };

  handleStatusFilter = args => {
    this.setState({
      statusFilter: args.selectedKeys,
    });
  };

  handleApplyStatusFilter = () => {
    this.setState({ statusFilterDropdownVisible: false });
  };
  handleResetStatusFilter = () => {
    this.setState({
      statusFilterDropdownVisible: false,
      statusFilter: [],
    });
  };

  render() {
    return (
      <div className="config-deps-list">
        <div className="toolbar no-top-margin">
          <h3>{this.props.depsType === 'deps' ? 'Dependencies' : 'Dev Depedencies'}</h3>
          <Button type="primary" size="small" onClick={this.handleAddPackage}>
            Add
          </Button>
          <Input
            value={this.state.inputValue}
            size="small"
            onChange={this.handleInputChange}
            onPressEnter={this.handleAddPackage}
          />
        </div>
        <Table columns={this.getColumns()} dataSource={this.getData()} size="small" pagination={false} rowKey="name" />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    bgProcesses: state.rekitTools.bgProcesses,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DepsList);
