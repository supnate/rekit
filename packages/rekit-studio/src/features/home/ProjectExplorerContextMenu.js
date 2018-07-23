import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import * as actions from './redux/actions';

export class ProjectExplorerContextMenu extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    contextMenu: [{ name: 'Add Action', key: 'add-action' }],
    targetId: null,
  };

  getMenuItems() {
    return this.state.contextMenu;
  }

  handleContextMenu = evt => {
    const targetId = evt.node.props.eventKey;
    const menus = this.getMenuItems(targetId);

    console.log('context menu: ', this.props.elementById[targetId]);
    if (!menus.length) return;

    this.setState({
      contextMenu: menus,
      targetId,
    });

    // When right click, set the current tree node context
    // this.createCmdContext(evt);

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
    console.log('menu click: ', evt.key, this.state.targetId);
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
