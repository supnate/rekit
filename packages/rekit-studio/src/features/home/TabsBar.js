import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu, Modal } from 'antd';
import classnames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import history from '../../common/history';
import { closeTab, moveTab } from './redux/actions';
import editorStateMap from './editorStateMap';
import modelManager from '../common/monaco/modelManager';
import { UnloadComponent } from '../common';
import { getElementData, getElementFiles } from './helpers';

const grid = 0;
const getListStyle = () => ({
  display: 'flex',
  padding: grid,
  overflow: 'auto',
});
export class TabsBar extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    rekitCmds: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.rekitCmds.execCmdPending &&
      !nextProps.rekitCmds.execCmdPending &&
      nextProps.rekitCmds.execCmdResult
    ) {
      // If current tab is renamed/moved/removed
      const cmdRes = nextProps.rekitCmds.execCmdResult;
      console.log('cmd exec result: ', cmdRes);
      if (/^(rename|move|remove)$/.test(cmdRes.args.commandName)) {
        const file = cmdRes.args.path;
        const tab = _.find(nextProps.home.openTabs, { key: file });
        if (tab) {
          this.handleClose({}, tab);
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.delayScroll) clearTimeout(this.delayScroll);
    // this.delayScroll = setTimeout(this.scrollActiveTabIntoView, 100);
  }

  getCurrentFile() {
    // only for element page
    const { pathname } = this.props.router.location;
    const arr = _.compact(pathname.split('/')).map(decodeURIComponent);
    if (arr[0] === 'element') return arr[1];
    return null;
  }

  getElementData(file) {
    const { elementById, projectRoot } = this.props.home;
    if (!file) return null;
    file = decodeURIComponent(file);
    const fullPath = projectRoot + file;
    const arr = fullPath.split('.');
    const ext = arr.length > 1 ? arr.pop() : null;
    const ele = elementById[file];

    if (!ele) return null;

    return {
      ...ele,
      hasDiagram: /^(js|jsx)$/.test(ext),
      hasTest: ele.feature && /^(js|jsx)$/.test(ext),
      hasCode: /^(js|jsx|html|css|less|scss|txt|json|sass|md|log|pl|py|sh|cmd)$/.test(ext),
      isPic: /^(jpe?g|png|gif|bmp)$/.test(ext),
    };
  }

  getTabTooltip(tab) {
    if (!_.startsWith(tab.key, '#')) return tab.key;
    return tab.name;
  }

  isChanged(tab) {
    const files = getElementFiles(this.props.home, tab.key);
    if (!files) return false;
    return (
      modelManager.isChanged(files.code) || modelManager.isChanged(files.test) || modelManager.isChanged(files.style)
    );
  }

  isCurrentTab(tab) {
    const { pathname } = document.location;
    switch (tab.type) {
      case 'home':
        return pathname === '/';
      case 'element':
        return tab.key === this.getCurrentFile();
      case 'routes':
        return pathname.indexOf(`/${tab.key}`) === 0;
      case 'tests':
        return _.startsWith(pathname, '/tools/tests');
      case 'coverage':
        return _.startsWith(pathname, '/tools/coverage');
      case 'build':
        return _.startsWith(pathname, '/tools/build');
      case 'deps':
        return _.startsWith(pathname, '/config/deps');
      default:
        return false;
    }
  }

  openTab = key => {
    const tab = _.find(this.props.home.openTabs, { key });
    let path;
    switch (tab.type) {
      case 'home':
        path = '/';
        break;
      case 'element':
        path = `/element/${encodeURIComponent(key)}/${tab.subTab}`;
        break;
      case 'routes':
        path = `/${tab.key}/${tab.subTab || ''}`;
        break;
      case 'tests':
      case 'coverage':
      case 'build':
      case 'deps':
        path = tab.pathname;
        break;
      default:
        console.error('unknown tab type: ', tab);
        break;
    }
    if (document.location.pathname !== path) {
      history.push(path);
    }
  };

  scrollActiveTabIntoView = () => {
    delete this.delayScroll;
    if (!this.rootNode) return;
    const node = this.rootNode.querySelector('.tab-active');
    if (node) {
      scrollIntoView(node, this.rootNode, {
        allowHorizontalScroll: true,
        onlyScrollIfNeeded: true,
        offsetRight: 100,
        offsetLeft: 100,
      });
    }
    this.rootNode.scrollTop = 0; // Prevent vertical offset when switching tabs.
  };

  handleClose = (evt, tab, force) => {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const files = getElementFiles(this.props.home, tab.key);
    const data = getElementData(this.props.home, tab.key);

    const doClose = () => {
      if (files) {
        delete editorStateMap[files.code];
        delete editorStateMap[files.style];
        delete editorStateMap[files.test];
        modelManager.reset(files.code);
        modelManager.reset(files.style);
        modelManager.reset(files.test);
      }

      this.props.actions.closeTab(tab.key);
      const { historyTabs } = this.props.home;
      if (historyTabs.length === 1) {
        history.push('/welcome');
      } else if (this.isCurrentTab(tab)) {
        // Close the current one
        const nextKey = historyTabs[1]; // at this point the props has not been updated.
        this.openTab(nextKey);
      }
    };

    if (!force && files && [files.code, files.test, files.style].some(f => modelManager.isChanged(f))) {
      Modal.confirm({
        title: 'Discard changes?',
        content: `Do you want to discard changes you made to ${data.name}?`,
        okText: 'Discard',
        onOk: () => {
          doClose();
        },
        onCancel: () => {},
      });
    } else {
      doClose();
    }
  };

  handleMenuClick = (tab, menuKey) => {
    const { openTabs } = this.props.home;
    switch (menuKey) {
      case 'close-others':
        openTabs.filter(t => t.key !== tab.key).forEach(t => this.handleClose({}, t));
        break;
      case 'close-right':
        openTabs.slice(_.findIndex(openTabs, { key: tab.key }) + 1).forEach(t => this.handleClose({}, t));
        break;
      case 'close-self':
        this.handleClose({}, tab);
        break;
      default:
        break;
    }
  };

  handleDragEnd = result => {
    this.props.actions.moveTab(result);
  };

  assignRef = node => {
    this.rootNode = node;
  };

  render() {
    const { openTabs, sidePanelWidth } = this.props.home;
    const getMenu = tab => (
      <Menu onClick={args => this.handleMenuClick(tab, args.key)}>
        <Menu.Item key="close-others">Close others</Menu.Item>
        <Menu.Item key="close-right">Close to the right</Menu.Item>
        <Menu.Item key="close-self">Close</Menu.Item>
      </Menu>
    );

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={node => {
                this.assignRef(node);
                provided.innerRef(node);
              }}
              className="home-tabs-bar"
              style={{ marginLeft: `${sidePanelWidth}px`, ...getListStyle(snapshot.isDraggingOver) }}
            >
              {openTabs.some(t => this.isChanged(t)) && <UnloadComponent />}
              {openTabs.map((tab, index) => (
                <Draggable key={tab.key} draggableId={tab.key} index={index}>
                  {(provided2, snapshot2) => (
                    <Dropdown overlay={getMenu(tab)} trigger={['contextMenu']} key={tab.key}>
                      <span
                        style={provided2.draggableProps.style}
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                        key={tab.key}
                        onClick={() => this.openTab(tab.key)}
                        className={classnames('tab', {
                          'is-dragging': snapshot2.isDragging,
                          'tab-active': this.isCurrentTab(tab),
                          'tab-has-change': this.isChanged(tab),
                        })}
                      >
                        <Icon type={tab.icon || 'file'} />
                        <label title={this.getTabTooltip(tab)}>{tab.name}</label>
                        <Icon type="close" onClick={evt => this.handleClose(evt, tab)} />
                      </span>
                    </Dropdown>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    rekitCmds: state.rekitCmds,
    router: state.router,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ closeTab, moveTab }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsBar);
