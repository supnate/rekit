import React, { Component } from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import * as actions from './redux/actions';
import plugin from '../../common/plugin';

export class ProjectExplorerContextMenu extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    contextMenu: [],
    elementId: null,
  };

  getMenuItems(elementId) {
    const menuItems = [];
    plugin.getPlugins('menu.contextMenu.fillMenuItems').forEach(p => {
      p.menu.contextMenu.fillMenuItems(menuItems, { elementId });
    });
    menuItems.sort((a, b) => (a.order || 10000) - (b.order || 10000));
    return menuItems;
  }

  handleRightClick = evt => {
    const elementId = evt.node.props.eventKey;
    const menus = this.getMenuItems(elementId);

    if (!menus.length) return;

    this.setState({
      contextMenu: menus,
      elementId,
    });

    this.contextMenuArchor.style.display = 'inline-block';
    const containerNode = ReactDOM.findDOMNode(this).parentNode; // eslint-disable-line
    const x = evt.event.clientX - containerNode.offsetLeft + containerNode.scrollLeft; // eslint-disable-line
    const y = evt.event.clientY - containerNode.offsetTop + containerNode.scrollTop; // eslint-disable-line
    this.contextMenuArchor.style.left = `${x}px`;
    this.contextMenuArchor.style.top = `${y}px`;
    // This seems to be the most compatible method for now, use standard new Event() when possible such as:
    // var ev = new Event("look", {"bubbles":true, "cancelable":false});
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
    const clickEvent = document.createEvent('HTMLEvents');
    clickEvent.initEvent('click', true, true);
    this.contextMenuArchor.dispatchEvent(clickEvent);
  };

  handleContextMenuVisibleChange = visible => {
    if (!visible) {
      this.contextMenuArchor.style.display = 'none';
    }
  };

  handleMenuClick = evt => {
    plugin.getPlugins('menu.contextMenu.handleMenuClick').forEach(p => {
      p.menu.contextMenu.handleMenuClick({ key: evt.key, elementId: this.state.elementId });
    });
  };

  renderContextMenu() {
    return (
      <Menu style={{ minWidth: 150 }} onClick={this.handleMenuClick} selectedKeys={[]}>
        {this.state.contextMenu.map(menuItem => <Menu.Item key={menuItem.key}>{menuItem.name}</Menu.Item>)}
      </Menu>
    );
  }

  render() {
    return (
      <Dropdown
        overlay={this.renderContextMenu()}
        trigger={['click']}
        onVisibleChange={this.handleContextMenuVisibleChange}
        ref={node => {
          this.rootNode = node;
        }}
      >
        <span
          ref={node => {
            this.contextMenuArchor = node;
          }}
          className="home-project-explorer-context-menu-archor"
        >
          &nbsp;
        </span>
      </Dropdown>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    elementById: state.home.projectData.elementById,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ProjectExplorerContextMenu);
