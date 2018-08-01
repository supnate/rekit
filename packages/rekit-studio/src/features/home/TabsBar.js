import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Icon, Dropdown, Menu, Modal } from 'antd';
import scrollIntoView from 'dom-scroll-into-view';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import history from '../../common/history';
import { SvgIcon } from '../common';
import { initTabs, closeTab, stickTab, moveTab } from './redux/actions';
import { tabsSelector } from './selectors/tabs';

const getListStyle = () => ({
  display: 'flex',
  padding: 0,
  overflow: 'auto',
});

export class TabsBar extends Component {
  static propTypes = {
    openTabs: PropTypes.array.isRequired,
    historyTabs: PropTypes.array.isRequired,
    sidePanelWidth: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    viewChanged: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: this.props.location,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      if (this.delayScroll) clearTimeout(this.delayScroll);
      this.delayScroll = setTimeout(this.scrollActiveTabIntoView, 100);
    }
  }

  getCurrentTab() {
    return _.find(this.props.openTabs, t => t.isActive);
  }

  isChanged(tab) {
    if (tab.subTabs && tab.subTabs.length) return tab.subTabs.some(this.isSubTabChanged);
    return this.props.viewChanged[tab.urlPath];
  }

  isSubTabChanged = subTab => this.props.viewChanged[subTab.urlPath];

  scrollActiveTabIntoView = () => {
    delete this.delayScroll;
    if (!this.rootNode) return;
    const node = this.rootNode.querySelector('.tab.is-active');
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

  handleSelectTab = tab => {
    history.push(tab.urlPath);
  };

  handleSelectSubTab = subTab => {
    history.push(subTab.urlPath);
  };

  handleClose = (evt, tab, force) => {
    if (evt && evt.stopPropagation) evt.stopPropagation();

    const { openTabs, historyTabs } = this.props;

    const doClose = () => {
      // if (files) {
      //   delete editorStateMap[files.code];
      //   delete editorStateMap[files.style];
      //   delete editorStateMap[files.test];
      //   modelManager.reset(files.code);
      //   modelManager.reset(files.style);
      //   modelManager.reset(files.test);
      // }

      this.props.actions.closeTab(tab.key);
      if (historyTabs.length === 1) {
        history.push('/welcome');
      } else if (tab.isActive) {
        // Close the current one
        const nextKey = historyTabs[1]; // at this point the props has not been updated.
        const tab = _.find(openTabs, { key: nextKey });
        history.push(tab.urlPath);
      }
    };

    if (!force && this.isChanged(tab)) {
      Modal.confirm({
        title: 'Discard changes?',
        content: `Do you want to discard changes you made to ${tab.name}?`,
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

  handleDragEnd = result => {
    this.props.actions.moveTab(result);
  };

  handleMenuClick = (tab, menuKey) => {
    const { openTabs } = this.props;
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

  assignRef = node => {
    this.rootNode = node;
  };

  renderSubTabs = () => {
    const { pathname } = this.props.location;
    const currentTab = this.getCurrentTab();
    const hasSubTabs = currentTab && currentTab.subTabs && currentTab.subTabs.length > 0;
    if (!hasSubTabs) return null;
    let activeSubTabPath = pathname;
    if (!currentTab.subTabs.some(t => t.urlPath === pathname)) {
      activeSubTabPath = _.find(currentTab.subTabs, 'isDefault').urlPath;
    }

    return (
      <div className="sub-tabs">
        {currentTab.subTabs.map(subTab => (
          <span
            key={subTab.key}
            className={classnames('sub-tab', {
              'is-active': activeSubTabPath === subTab.urlPath,
              'is-changed': this.isSubTabChanged(subTab),
            })}
            onClick={() => this.handleSelectSubTab(subTab)}
          >
            {subTab.name}
            {this.isSubTabChanged(subTab) ? <span style={{ color: '#108ee9' }}> *</span> : null}
          </span>
        ))}
      </div>
    );
  };

  renderTab = (tab, index) => {
    const getMenu = tab => (
      <Menu onClick={args => this.handleMenuClick(tab, args.key)}>
        <Menu.Item key="close-others">Close others</Menu.Item>
        <Menu.Item key="close-right">Close to the right</Menu.Item>
        <Menu.Item key="close-self">Close</Menu.Item>
      </Menu>
    );
    return (
      <Draggable key={tab.key} draggableId={tab.key} index={index}>
        {provided => (
          <Dropdown overlay={getMenu(tab)} trigger={['contextMenu']} key={tab.key}>
            <span
              key={tab.key}
              onClick={() => this.handleSelectTab(tab)}
              onDoubleClick={() => this.props.actions.stickTab(tab.key)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={classnames('tab', {
                'is-active': tab.isActive,
                'is-changed': this.isChanged(tab),
                'is-temp': tab.isTemp,
              })}
            >
              <SvgIcon type={tab.icon || 'file'} />
              <label>{tab.name}</label>
              <Icon type="close" onClick={evt => this.handleClose(evt, tab)} />
            </span>
          </Dropdown>
        )}
      </Draggable>
    );
  };

  render() {
    const { openTabs, sidePanelWidth } = this.props;
    const currentTab = this.getCurrentTab();
    const hasSubTabs = currentTab && currentTab.subTabs && currentTab.subTabs.length > 0;
    return (
      <div
        className={classnames('home-tabs-bar', { 'has-sub-tabs': hasSubTabs })}
        style={{ marginLeft: `${sidePanelWidth}px` }}
      >
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {provided => (
              <div
                className="main-tabs"
                ref={node => {
                  this.assignRef(node);
                  provided.innerRef(node);
                }}
                style={{ ...getListStyle() }}
              >
                {openTabs.map(this.renderTab)}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {this.renderSubTabs()}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, ['openTabs', 'projectRoot', 'historyTabs', 'sidePanelWidth', 'viewChanged']),
    pathname: state.router.pathname,
    tabs: tabsSelector(state),
    location: state.router.location,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ initTabs, closeTab, stickTab, moveTab }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabsBar);
