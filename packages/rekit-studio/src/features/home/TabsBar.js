import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Icon } from 'antd';
import history from '../../common/history';
import { SvgIcon } from '../common';
import plugin from '../plugin/plugin';
import * as actions from './redux/actions';

export class TabsBar extends Component {
  static propTypes = {
    openTabs: PropTypes.array.isRequired,
    sidePanelWidth: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
  };

  isCurrentTab(tab) {}
  isChanged(tab) {}

  getTab = (urlPath) => {
    let tab = null;
    plugin
      .getPlugins()
      .reverse()
      .some(p => {
        if (p.tab && p.tab.getTab) {
          tab = p.tab.getTab(urlPath);
        }
        return !!tab;
      });
    return tab;
  };

  handleSelectTab = tab => {
    history.push(tab.urlPath);
    // const tab = _.find(this.props.openTabs, { key });

    // let path;
    // switch (tab.type) {
    //   case 'home':
    //     path = '/';
    //     break;
    //   case 'element':
    //     path = `/element/${encodeURIComponent(key)}/${tab.subTab}`;
    //     break;
    //   case 'routes':
    //     path = `/${tab.key}/${tab.subTab || ''}`;
    //     break;
    //   case 'tests':
    //   case 'coverage':
    //   case 'build':
    //   case 'deps':
    //     path = tab.pathname;
    //     break;
    //   default:
    //     console.error('unknown tab type: ', tab);
    //     break;
    // }
    // if (document.location.pathname !== path) {
    //   history.push(path);
    // }
  };

  handleSelectSubTab = subTab => {};

  handleClose = (evt, tab) => {};

  renderTab = (tab) => {
    return (
      <span
        key={tab.key}
        onClick={() => this.handleSelectTab(tab)}
        onDoubleClick={() => this.props.actions.stickTab(tab.key)}
        className={classnames('tab', {
          'is-active': this.isCurrentTab(tab),
          'has-change': this.isChanged(tab),
          'is-temp': tab.isTemp,
        })}
      >
        <SvgIcon type={tab.icon || 'file'} />
        <label>{tab.name}</label>
        <Icon type="close" onClick={evt => this.handleClose(evt, tab)} />
      </span>
    );
  };

  render() {
    const { openTabs, sidePanelWidth } = this.props;
    console.log('open tabs: ', openTabs);
    const tabs = _.compact(openTabs.map(this.getTab));
    console.log('tabs: ', tabs);
    return (
      <div className="home-tabs-bar" style={{ marginLeft: `${sidePanelWidth}px` }}>
        {tabs.map(this.renderTab)}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, ['openTabs', 'projectRoot', 'historyTabs', 'sidePanelWidth']),
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
  mapDispatchToProps
)(TabsBar);
