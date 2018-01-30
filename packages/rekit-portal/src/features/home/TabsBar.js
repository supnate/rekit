import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu } from 'antd';
import classnames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import history from '../../common/history';
import { closeTab } from './redux/actions';
import editorStateMap from './editorStateMap';

export class TabsBar extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

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
      default:
        return false;
    }
  }

  openTab = (key) => {
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
        path = tab.pathname;
        break;
      default:
        console.error('unknown tab type: ', tab);
        break;
    }
    if (document.location.pathname !== path) {
      history.push(path);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.delayScroll) clearTimeout(this.delayScroll);
    this.delayScroll = setTimeout(this.scrollActiveTabIntoView, 100);
  }

  scrollActiveTabIntoView = () => {
    delete this.delayScroll;
    if (!this.rootNode) return;
    scrollIntoView(
      this.rootNode.querySelector('.tab-active'),
      this.rootNode,
      {
        allowHorizontalScroll: true,
        onlyScrollIfNeeded: true,
        offsetRight: 100,
        offsetLeft: 100,
      }
    );
    this.rootNode.scrollTop = 0;  // Prevent vertical offset when switching tabs.
  }

  handleClose = (evt, tab) => {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    this.props.actions.closeTab(tab.key);
    const { historyTabs, cssExt } = this.props.home;
    const ele = this.getElementData(tab.key);
    if (ele) {
      const codeFile = ele.file;
      const styleFile = `src/features/${ele.feature}/${ele.name}.${cssExt}`;
      const testFile = `tests/${ele.file.replace(/^src\//, '').replace('.js', '')}.test.js`;

      delete editorStateMap[codeFile];
      delete editorStateMap[styleFile];
      delete editorStateMap[testFile];
    }

    if (historyTabs.length === 1) {
      history.push('/welcome');
    } else if (this.isCurrentTab(tab)) {
      // Close the current one
      const nextKey = historyTabs[1]; // at this point the props has not been updated.
      this.openTab(nextKey);
    }
  }

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
  }

  assignRef = (node) => {
    this.rootNode = node;
  }

  render() {
    const { openTabs } = this.props.home;
    const getMenu = tab => (
      <Menu onClick={args => this.handleMenuClick(tab, args.key)}>
        <Menu.Item key="close-others">Close others</Menu.Item>
        <Menu.Item key="close-right">Close to the right</Menu.Item>
        <Menu.Item key="close-self">Close</Menu.Item>
      </Menu>
    );
    return (
      <div className="home-tabs-bar" ref={this.assignRef}>
        {openTabs.map(tab => (
          <Dropdown overlay={getMenu(tab)} trigger={['contextMenu']} key={tab.key}>
            <span
              key={tab.key}
              onClick={() => this.openTab(tab.key)}
              className={classnames('tab', { 'tab-active': this.isCurrentTab(tab) })}
            >
              <Icon type={tab.icon || 'file'} />
              <label title={this.getTabTooltip(tab)}>{tab.name}</label>
              <Icon type="close" onClick={(evt) => this.handleClose(evt, tab)} />
            </span>
          </Dropdown>
        ))}       
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    router: state.router,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ closeTab }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabsBar);
