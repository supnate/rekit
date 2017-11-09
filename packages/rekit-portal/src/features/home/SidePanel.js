import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Dropdown, Icon, Menu, Modal } from 'antd';
import * as actions from './redux/actions';
import history from '../../common/history';
import { SearchInput } from '../common';
import { showCmdDialog } from '../rekit-cmds/redux/actions';
import { About, DemoAlert, ProjectExplorer } from './';

export class SidePanel extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    searchKey: null,
    aboutDialogVisible: process.env.REKIT_ENV === 'demo',
  };

  @autobind
  showAbout() {
    this.setState({
      aboutDialogVisible: true,
    });
  }

  @autobind
  hideAbout() {
    this.setState({
      aboutDialogVisible: false,
    });
  }

  @autobind
  handleAddMenuClick(evt) {
    switch (evt.key) {
      case 'add-feature':
      case 'add-component':
      case 'add-action':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'build':
        history.push('/tools/build');
        break;
      case 'tests':
        history.push('/tools/tests');
        break;
      case 'test-coverage':
        history.push('/tools/coverage');
        break;
      case 'about':
        this.showAbout();
        break;
      default:
        break;
    }
  }

  @autobind
  handleSearch(key) {
    this.setState({
      searchKey: key,
    });
  }

  @autobind
  renderAddMenu() {
    return (
      <Menu onClick={this.handleAddMenuClick}>
        <Menu.Item key="add-feature"><Icon type="book" style={{ color: '#29b6f6' }} /> &nbsp;Add feature</Menu.Item>
        <Menu.Item key="add-action"><Icon type="notification" style={{ color: '#ec407a' }} /> &nbsp;Add action</Menu.Item>
        <Menu.Item key="add-component"><Icon type="appstore-o" style={{ color: '#F08036' }} /> &nbsp;Add component</Menu.Item>
        <Menu.Item key="tests"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Run tests</Menu.Item>
        <Menu.Item key="test-coverage"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Test coverage</Menu.Item>
        <Menu.Item key="build"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Build</Menu.Item>
        <Menu.Item key="about"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;About</Menu.Item>
      </Menu>
    );
  }

  render() {
    const { home } = this.props;
    const prjName = home.projectName || home.projectRoot.split('/').pop();
    return (
      <div className="home-side-panel dark-theme">
        <div className="header">
          <Link className="home-link" to="/" title={this.props.home.projectRoot}>
            <h5><Icon type="home" /> {prjName}</h5>
          </Link>
          <Dropdown overlay={this.renderAddMenu()}>
            <label>
              <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
            </label>
          </Dropdown>
        </div>
        <div className="toolbar">
          <SearchInput onSearch={this.handleSearch} />
        </div>
        <ProjectExplorer searchKey={this.state.searchKey} />
        {this.state.aboutDialogVisible &&
          <Modal
            visible
            maskClosable
            title=""
            footer=""
            width={process.env.REKIT_ENV === 'demo' ? '760px' : '360px'}
            onClose={this.hideAbout}
            style={{ top: '50px' }}
          >
            <About />
          </Modal>
        }
        {home.demoAlertVisible && <DemoAlert onClose={this.props.actions.hideDemoAlert} />}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, showCmdDialog }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
