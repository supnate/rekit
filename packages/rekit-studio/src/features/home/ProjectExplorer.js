import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu, message, Modal, Tooltip, Tree, Spin } from 'antd';
import scrollIntoView from 'dom-scroll-into-view';
import history from '../../common/history';
import { storage } from '../common/utils';
import cmdSuccessNotification from '../rekit-cmds/cmdSuccessNotification';
import { execCmd, showCmdDialog, dismissExecCmdError } from '../rekit-cmds/redux/actions';
import { getExpandedKeys, getFilteredExplorerTreeData } from './selectors/explorerTreeData';
import { stickTab } from './redux/actions';

const TreeNode = Tree.TreeNode;

const menuItems = {
  addAction: { name: 'Add Action', key: 'add-action' },
  addComponent: { name: 'Add Component', key: 'add-component' },
  addFeature: { name: 'Add Feature', key: 'add-feature' },
  del: { name: 'Delete', key: 'del' },
  move: { name: 'Move', key: 'move' },
  rename: { name: 'Rename', key: 'rename' },
  showTest: { name: 'Unit Test', key: 'show-test' },
  runTest: { name: 'Run Test', key: 'run-test' },
  runTests: { name: 'Run Tests', key: 'run-tests' },
  showStyle: { name: 'Style', key: 'show-style' },
  newFile: { name: 'New File', key: 'new-file' },
  newFolder: { name: 'New Folder', key: 'new-folder' },
};

export class ProjectExplorer extends Component {
  static propTypes = {
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
    this.state.expandedKeys = storage.local.getItem('explorerExpandedKeys', defaultOpen, true);
  }
  state = {
    expandedKeys: [],
    contextMenu: [],
    selectedKey: null,
  };

  componentDidUpdate(prevProps) {
    if (!this.rootNode) return;
    if (this.getSelectedKey(prevProps) !== this.getSelectedKey(this.props)) {
      const targetNode = this.rootNode.querySelector('.ant-tree-node-selected');
      if (targetNode) {
        scrollIntoView(targetNode, this.rootNode, {
          onlyScrollIfNeeded: true,
          offsetTop: 50,
          offsetBottom: 50,
        });
      }
    }
  }

  getSelectedKey(props) {
    // selected tree node always maps to an url path
    const arr = props.router.location.pathname.split('/');
    if (arr[1] === 'element') return decodeURIComponent(arr[2]);
    if (arr[2] === 'routes') return `${arr[1]}-routes`;
    return null;
  }
  getMenuItems(treeNode) {
    const evtKey = treeNode.props.eventKey;
    // eventKey is 'file' property of most items
    const { elementById, featureById } = this.props;
    let ele = elementById[evtKey] || featureById[evtKey];
    if (!ele) {
      const key = treeNode.props.eventKey;
      const i = key.lastIndexOf('-');
      ele = {
        type: key.substring(i + 1),
      };
    }
    switch (ele.type) {
      case 'features':
        return [menuItems.addFeature, menuItems.runTests];
      case 'feature':
        return [menuItems.addComponent, menuItems.addAction, menuItems.rename, menuItems.runTests, menuItems.del];
      case 'routes':
        break;
      case 'actions':
        return [menuItems.addAction, menuItems.runTests];
      case 'action':
        return [menuItems.rename, menuItems.move, menuItems.runTest, menuItems.del];
      case 'components':
        return [menuItems.addComponent, menuItems.runTests];
      case 'component':
        return [menuItems.rename, menuItems.move, menuItems.runTest, menuItems.del];
      default:
        break;
    }
    const className = treeNode.props.className;
    switch (className) {
      case 'misc':
      case 'others':
        return [menuItems.newFile, menuItems.newFolder];
      case 'misc-folder':
        return [menuItems.newFile, menuItems.newFolder, menuItems.rename, menuItems.del];
      case 'misc-file':
        return [menuItems.rename, menuItems.del];
      default:
        break;
    }

    return [];
  }

  createCmdContext(evt) {
    // when right click a menu item, need to cache the node context for context menu usage.

    const key = evt.node.props.eventKey;
    const { elementById, featureById } = this.props;
    const ele = elementById[key] || featureById[key];
    if (ele) {
      this.cmdContext = {
        feature: ele.feature,
        elementType: ele.type === 'misc' ? 'file' : ele.type,
        elementName: ele.name,
        file: key,
      };
    } else if (key.includes('/')) {
      // it's a folder because a file must be an ele
      const arr = key.split('/');
      this.cmdContext = {
        feature: arr[1] === 'features' ? arr[2] : null,
        elementType: 'folder',
        file: key,
        elementName: _.last(arr), // element name is the file path
      };
    } else if (key === 'others-node') {
      this.cmdContext = {
        feature: null,
        elementType: 'others-node',
        elementName: null,
        file: 'src',
      };
    } else {
      // for <feature>.routes, .actions, .components, .misc
      const i = key.lastIndexOf('-');
      const feature = key.substring(0, i);
      const elementType = key.substring(i + 1);
      this.cmdContext = {
        feature,
        elementType,
        elementName: null,
        file: `src/features/${feature}`,
      };
    }
  }

  handleSelect = (selected, evt) => {
    const key = evt.node.props.eventKey;

    const hasChildren = !!_.get(evt, 'node.props.children');
    // const keysInCookie = Cookies.getJSON('explorerExpandedKeys');

    // let expandedKeys = keysInCookie || this.state.expandedKeys;
    let expandedKeys = storage.local.getItem('explorerExpandedKeys');
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
        history.push(`/element/${encodeURIComponent(key)}/rules`); // eslint-disable-line
      } else {
        const tabItem = _.find(this.props.openTabs, { key });
        const subTab = tabItem ? tabItem.subTab : 'code';
        history.push(`/element/${encodeURIComponent(key)}/${subTab}`);
      }
    }

    // Cookies.set('explorerExpandedKeys', expandedKeys, { expires: 999 });
    storage.local.setItem('explorerExpandedKeys', expandedKeys);
    this.setState({
      selectedKey,
      expandedKeys,
    });
  };

  handleExpand = (expanded, evt) => {
    const key = evt.node.props.eventKey;
    // const keysInCookie = Cookies.getJSON('explorerExpandedKeys');

    // let expandedKeys = keysInCookie || this.state.expandedKeys;
    let expandedKeys = storage.local.getItem('explorerExpandedKeys');

    if (expandedKeys.includes(key)) {
      expandedKeys = expandedKeys.filter(k => k !== key);
    } else {
      expandedKeys = [...expandedKeys, key];
    }

    storage.local.setItem('explorerExpandedKeys', expandedKeys);
    // Cookies.set('explorerExpandedKeys', expandedKeys, { expires: 999 });
    this.setState({
      expandedKeys,
    });
  };

  handleContextMenu = evt => {
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
  };

  handleContextMenuVisibleChange = visible => {
    if (!visible) {
      this.contextMenuArchor.style.display = 'none';
    }
  };

  handleMenuClick = evt => {
    const cmdContext = this.cmdContext;
    const prjRoot = this.props.projectRoot;
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
          content:
            cmdContext.elementType === 'feature'
              ? `Delete ${cmdContext.elementType}: ${cmdContext.elementName} ? `
              : cmdContext.feature
                ? `Delete ${cmdContext.elementType}: ${cmdContext.feature}/${cmdContext.elementName} ? `
                : `Delete ${cmdContext.elementType}: ${cmdContext.file} ?`,
          onOk: () => {
            const hide = message.loading(`Deleting ${cmdContext.elementName}`, 0);
            this.props.actions
              .execCmd({
                path: this.cmdContext.file || null,
                commandName: 'remove',
                type: cmdContext.elementType,
                name:
                  cmdContext.elementType === 'feature'
                    ? `${cmdContext.elementName}`
                    : `${cmdContext.feature}/${cmdContext.elementName}`,
              })
              .then(() => {
                hide();
                cmdSuccessNotification(
                  {
                    commandName: 'delete',
                    type: cmdContext.elementType,
                  },
                  this.props.actions.showCmdDialog
                );
              })
              .catch((e = 'Unknown error.') => {
                hide();
                Modal.error({
                  title: 'Failed to delete',
                  content: e.toString(),
                });
              });
          },
        });

        break;
      case 'new-file':
      case 'new-folder':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      default:
        break;
    }
  };

  handleTreeNodeDoubleClick = () => {
    setTimeout(this.props.actions.stickTab, 50);
  };

  hasSyntaxError(nodeData) {
    return this.props.filesHasSyntaxError[nodeData.key];
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
      <Menu style={{ minWidth: 150 }} onClick={this.handleMenuClick} selectedKeys={[]}>
        {this.state.contextMenu.map(menuItem => <Menu.Item key={menuItem.key}>{menuItem.name}</Menu.Item>)}
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
    const syntaxError = this.hasSyntaxError(nodeData);
    let ele = (
      <span className={syntaxError ? 'has-syntax-error' : ''} onDoubleClick={this.handleTreeNodeDoubleClick}>
        {nodeData.icon && this.renderTreeNodeIcon(syntaxError ? 'close-circle-o' : nodeData.icon)}
        <label>
          {nodeData.searchable ? this.renderHighlightedTreeNodeLabel(nodeData.label) : nodeData.label}
          {_.has(nodeData, 'count') ? ` (${nodeData.count})` : ''}
        </label>
        {nodeData.marks &&
          nodeData.marks.map(mark => (
            <span key={mark} title={markDescription[mark.toLowerCase()]} className={`mark mark-${mark.toLowerCase()}`}>
              {mark}
            </span>
          ))}
      </span>
    );
    if (syntaxError) {
      ele = (
        <Tooltip placement="top" title="There's syntax error in the file, please fix.">
          {ele}
        </Tooltip>
      );
    }
    return ele;
  }

  renderTreeNode = nodeData => (
    <TreeNode
      key={nodeData.key}
      title={this.renderTreeNodeTitle(nodeData)}
      className={nodeData.className}
      isLeaf={!nodeData.children}
    >
      {nodeData.children && nodeData.children.map(this.renderTreeNode)}
    </TreeNode>
  );

  render() {
    const { features, srcFiles, featureById, treeData, searchKey } = this.props;

    if (!features) {
      return this.renderLoading();
    }

    const treeNodes = treeData.children.map(this.renderTreeNode);
    let expandedKeys = this.state.expandedKeys;
    if (searchKey) {
      expandedKeys = getExpandedKeys(
        {
          srcFiles,
          features,
          featureById,
        },
        searchKey
      );
    }

    return (
      <div
        className="home-project-explorer"
        ref={node => {
          this.rootNode = node;
        }}
      >
        {treeNodes.length > 0 ? (
          <Tree
            autoExpandParent={false}
            selectedKeys={[this.getSelectedKey(this.props)]}
            expandedKeys={expandedKeys}
            onRightClick={this.handleContextMenu}
            onSelect={this.handleSelect}
            onExpand={this.handleExpand}
          >
            {treeNodes}
          </Tree>
        ) : (
          <div className="no-results">No results.</div>
        )}
        <Dropdown
          overlay={this.renderContextMenu()}
          trigger={['click']}
          onVisibleChange={this.handleContextMenuVisibleChange}
        >
          <span
            ref={node => {
              this.contextMenuArchor = node;
            }}
            className="context-menu-archor"
          >
            &nbsp;
          </span>
        </Dropdown>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state, props) {
  // const home = state.home,
  return {
    // elementById: elementById,
    // features: features,
    // featureById: featureById,
    // home: _.
    ..._.pick(state.home, [
      'elementById',
      'features',
      'featureById',
      'openTabs',
      'projectRoot',
      'filesHasSyntaxError',
      'srcFiles',
    ]),
    treeData: getFilteredExplorerTreeData(state.home, props.searchKey),
    router: state.router,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ execCmd, showCmdDialog, dismissExecCmdError, stickTab }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectExplorer);
