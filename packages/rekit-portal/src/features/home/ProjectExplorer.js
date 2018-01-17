import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Dropdown, Icon, Menu, message, Modal, Tree, Spin } from 'antd';
import history from '../../common/history';
import cmdSuccessNotification from '../rekit-cmds/cmdSuccessNotification';
import * as actions from './redux/actions';
import { execCmd, showCmdDialog, dismissExecCmdError } from '../rekit-cmds/redux/actions';
import { getExpandedKeys, getFilteredExplorerTreeData } from './selectors/explorerTreeData';

const TreeNode = Tree.TreeNode;

const menuItems = {
  addAction: { name: 'Add action', key: 'add-action' },
  addComponent: { name: 'Add component', key: 'add-component' },
  addFeature: { name: 'Add feature', key: 'add-feature' },
  del: { name: 'Delete', key: 'del' },
  move: { name: 'Move', key: 'move' },
  rename: { name: 'Rename', key: 'rename' },
  showTest: { name: 'Unit test', key: 'show-test' },
  runTest: { name: 'Run test', key: 'run-test' },
  runTests: { name: 'Run tests', key: 'run-tests' },
  showStyle: { name: 'Style', key: 'show-style' },
};

export class ProjectExplorer extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    searchKey: PropTypes.string,
    treeData: PropTypes.object.isRequired,
  };

  static defaultProps = {
    searchKey: '',
  };

  constructor(props) {
    super(props);
    const defaultOpen = ['features'];
    if (!Cookies.getJSON('explorerExpandedKeys')) {
      Cookies.set('explorerExpandedKeys', defaultOpen);
    }
    this.state.expandedKeys = Cookies.getJSON('explorerExpandedKeys');
  }
  state = {
    expandedKeys: [],
    contextMenu: [],
    selectedKey: null,
  };

  getMenuItems(treeNode) {
    const evtKey = treeNode.props.eventKey;
    // eventKey is 'file' property of most items
    const { home } = this.props;
    let ele = home.elementById[evtKey] || home.featureById[evtKey];
    if (!ele) {
      const key = treeNode.props.eventKey;
      const i = key.lastIndexOf('-');
      ele = {
        type: key.substring(i + 1),
      };
    }
    switch (ele.type) {
      case 'features':
        return [
          menuItems.addFeature,
          menuItems.runTests,
        ];
      case 'feature':
        return [
          menuItems.addComponent,
          menuItems.addAction,
          menuItems.rename,
          menuItems.runTests,
          menuItems.del,
        ];
      case 'routes':
        break;
      case 'actions':
        return [
          menuItems.addAction,
          menuItems.runTests,
        ];
      case 'action':
        return [
          menuItems.rename,
          menuItems.move,
          menuItems.runTest,
          menuItems.del,
        ];
      case 'components':
        return [
          menuItems.addComponent,
          menuItems.runTests,
        ];
      case 'component':
        return [
          menuItems.rename,
          menuItems.move,
          menuItems.runTest,
          menuItems.del,
        ];
      case 'misc':
        break;
      case 'misc-file':
        break;
      default:
        break;
    }
    return [];
  }

  createCmdContext(evt) {
    // when right click a menu item, need to cache the node context for context menu usage.

    const key = evt.node.props.eventKey;
    const { home } = this.props;
    const ele = home.elementById[key] || home.featureById[key];

    if (ele) {
      this.cmdContext = {
        feature: ele.feature,
        elementType: ele.type,
        elementName: ele.name,
        file: key,
      };
    } else {
      // for <feature>.routes, .actions, .components, .misc
      const i = key.lastIndexOf('-');
      this.cmdContext = {
        feature: key.substring(0, i),
        elementType: key.substring(i + 1),
        elementName: null,
      };
    }
  }

  @autobind
  handleSelect(selected, evt) {
    const key = evt.node.props.eventKey;

    const hasChildren = !!_.get(evt, 'node.props.children');
    const keysInCookie = Cookies.getJSON('explorerExpandedKeys');

    let expandedKeys = keysInCookie || this.state.expandedKeys;
    let selectedKey = this.state.selectedKey;
    if (hasChildren) {
      // toggle expanding
      if (expandedKeys.includes(key)) {
        expandedKeys = expandedKeys.filter(k => k !== key);
      } else {
        expandedKeys = [...expandedKeys, key];
      }
    } else {
      // key is the relative file path
      selectedKey = key;

      if (evt.node.props.className === 'routes') {
        // feature's routes
        history.push(`/${key.replace('-routes', '')}/routes`);
      } else {
        // const prjRoot = this.props.home.projectRoot;
        // const ele = this.props.home.elementById[key];
        // const file = key.replace(`${prjRoot}/src/features/${ele.feature}/`, '');

        let tab = '';
        if (/element\/[^/]+\/(code|diagram|style|test)$/.test(document.location.pathname)) {
          // remember the current tab
          tab = `/${RegExp.$1}`;
        }

        history.push(`/element/${encodeURIComponent(key)}${tab}`);
        // history.push(`/element/?file=${key}`);
        // history.push(`/element/${ele.feature || '_src_'}/${encodeURIComponent(file)}${tab}`);
      }
    }

    Cookies.set('explorerExpandedKeys', expandedKeys, { expires: 999 });
    this.setState({
      selectedKey,
      expandedKeys,
    });
  }

  @autobind
  handleExpand(expanded, evt) {
    const key = evt.node.props.eventKey;
    const keysInCookie = Cookies.getJSON('explorerExpandedKeys');

    let expandedKeys = keysInCookie || this.state.expandedKeys;
    if (expandedKeys.includes(key)) {
      expandedKeys = expandedKeys.filter(k => k !== key);
    } else {
      expandedKeys = [...expandedKeys, key];
    }

    Cookies.set('explorerExpandedKeys', expandedKeys, { expires: 999 });
    this.setState({
      expandedKeys,
    });
  }

  @autobind
  handleContextMenu(evt) {
    const menus = this.getMenuItems(evt.node);
    if (!menus.length) return;

    this.setState({
      contextMenu: menus,
    });

    // When right click, set the current tree node context
    this.createCmdContext(evt);

    this.contextMenuArchor.style.display = 'inline-block';
    const x = evt.event.clientX - this.rootNode.offsetLeft + this.rootNode.scrollLeft; // eslint-disable-line
    const y = evt.event.clientY - this.rootNode.offsetTop + this.rootNode.scrollTop; // eslint-disable-line
    this.contextMenuArchor.style.left = `${x}px`;
    this.contextMenuArchor.style.top = `${y}px`;
    // This seems to be the most compatible method for now, use standard new Event() when possible such as:
    // var ev = new Event("look", {"bubbles":true, "cancelable":false});
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
    const clickEvent = document.createEvent('HTMLEvents');
    clickEvent.initEvent('click', true, true);
    this.contextMenuArchor.dispatchEvent(clickEvent);
  }

  @autobind
  handleContextMenuVisibleChange(visible) {
    if (!visible) {
      this.contextMenuArchor.style.display = 'none';
    }
  }

  @autobind
  handleMenuClick(evt) {
    const cmdContext = this.cmdContext;
    const prjRoot = this.props.home.projectRoot;
    switch (evt.key) {
      case 'add-feature':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'add-component':
      case 'add-action':
      case 'move':
      case 'rename':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'run-test': {
        const relFile = cmdContext.file.replace(`${prjRoot}/`, '');
        history.push(`/tools/tests/${encodeURIComponent(relFile)}`);
        break;
      }
      case 'run-tests':
        if (cmdContext.elementType === 'features') {
          // features node
          history.push('/tools/tests/features');
        } else if (!cmdContext.elementName) {
          // components, actions
          history.push(`/tools/tests/${cmdContext.feature}%2F${cmdContext.elementType}`);
        } else if (cmdContext.elementType === 'feature') {
          // feature node
          history.push(`/tools/tests/${cmdContext.feature}`);
        }
        break;
      case 'del':
        Modal.confirm({
          title: 'Confirm',
          content: cmdContext.elementType === 'feature'
            ? `Delete ${cmdContext.elementType}: ${cmdContext.elementName} ? `
            : `Delete ${cmdContext.elementType}: ${cmdContext.feature}/${cmdContext.elementName} ? `,
          onOk: () => {
            const hide = message.loading(`Deleting ${cmdContext.elementName}`, 0);
            this.props.actions.execCmd({
              commandName: 'remove',
              type: cmdContext.elementType,
              name: cmdContext.elementType === 'feature'
                ? `${cmdContext.elementName}`
                : `${cmdContext.feature}/${cmdContext.elementName}`,
            })
            .then(() => {
              hide();
              cmdSuccessNotification({
                commandName: 'delete',
                type: cmdContext.elementType,
              }, this.props.actions.showCmdDialog);
            })
            .catch((e = 'Unknown error.') => {
              Modal.error({
                title: 'Failed to delete',
                content: e.toString(),
              });
            });
          }
        });

        break;
      default:
        break;
    }
  }

  renderLoading() {
    return (
      <div className="home-project-explorer">
        <Spin />
      </div>
    );
  }

  renderContextMenu() {
    return (
      <Menu
        style={{ minWidth: 150 }}
        onClick={this.handleMenuClick}
        selectedKeys={[]}
      >
        {
          this.state.contextMenu.map(menuItem => <Menu.Item key={menuItem.key}>{menuItem.name}</Menu.Item>)
        }
      </Menu>
    );
  }

  renderHighlightedTreeNodeLabel(label) {
    const searchKey = this.props.searchKey;
    if (!searchKey) return label;
    const i = label.toLowerCase().indexOf(searchKey.toLowerCase());
    if (i === -1) return label;
    return (
      <span>
        {label.substring(0, i)}
        <span className="search-highlight">{label.substring(i, i + searchKey.length)}</span>
        {label.substring(i + searchKey.length, label.length)}
      </span>
    );
  }

  renderTreeNodeIcon(icon) {
    if (icon === 'features') {
      return <img src={require('../../images/logo_small.png')} alt="" />;
    }
    return <Icon type={icon} />;
  }

  renderTreeNodeTitle(nodeData) {
    const markDescription = {
      a: 'Async action',
      c: 'Connected to Redux store',
      r: 'Used in route config',
    };
    return (
      <span>
        {nodeData.icon && this.renderTreeNodeIcon(nodeData.icon)}
        <label>
          {nodeData.searchable ? this.renderHighlightedTreeNodeLabel(nodeData.label) : nodeData.label}
          {_.has(nodeData, 'count') ? ` (${nodeData.count})` : ''}
        </label>
        {
          nodeData.marks && nodeData.marks.map(mark => (
            <span
              key={mark}
              title={markDescription[mark.toLowerCase()]}
              className={`mark mark-${mark.toLowerCase()}`}
            >{mark}</span>
          ))
        }
      </span>
    );
  }

  @autobind
  renderTreeNode(nodeData) {
    return (
      <TreeNode
        key={nodeData.key}
        title={this.renderTreeNodeTitle(nodeData)}
        className={nodeData.className}
        isLeaf={!nodeData.children}
      >
        {nodeData.children && nodeData.children.map(this.renderTreeNode)}
      </TreeNode>
    );
  }

  render() {
    const { home, treeData, searchKey } = this.props;

    if (!home.features) {
      return this.renderLoading();
    }

    const treeNodes = treeData.children.map(this.renderTreeNode);
    let expandedKeys = this.state.expandedKeys;
    if (searchKey) {
      expandedKeys = getExpandedKeys(home, searchKey);
    }

    return (
      <div className="home-project-explorer" ref={(node) => { this.rootNode = node; }}>
        {treeNodes.length > 0 ? <Tree
          autoExpandParent={false}
          selectedKeys={[this.state.selectedKey]}
          expandedKeys={expandedKeys}
          onRightClick={this.handleContextMenu}
          onSelect={this.handleSelect}
          onExpand={this.handleExpand}
        >
          {treeNodes}
        </Tree>
        : <div className="no-results">No results.</div>}
        <Dropdown overlay={this.renderContextMenu()} trigger={['click']} onVisibleChange={this.handleContextMenuVisibleChange}>
          <span ref={(node) => { this.contextMenuArchor = node; }} className="context-menu-archor">&nbsp;</span>
        </Dropdown>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state, props) {
  return {
    home: state.home,
    treeData: getFilteredExplorerTreeData(state.home, props.searchKey),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, execCmd, showCmdDialog, dismissExecCmdError }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectExplorer);
