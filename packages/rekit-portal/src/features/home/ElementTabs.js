import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import classnames from 'classnames';
import history from '../../common/history';
import { openTab, closeTab } from './redux/actions';

export class ElementTabs extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  handleTabClick = (tab) => {
    const path = `/element/${encodeURIComponent(tab.file)}/${tab.tab}`;
    if (document.location.pathname !== tab) {
      this.props.actions.openTab(tab.file, tab.tab);
      history.push(path);
    }
  }

  handleClose = (evt, tab) => {
    evt.stopPropagation();
    this.props.actions.closeTab(tab.file);
    const { openTabs, historyTabs } = this.props.home;
    const currentFile = decodeURIComponent(this.props.match.params.file);

    if (historyTabs.length === 1) {
      history.push('/');
    } else if (tab.file === currentFile) {
      // Close the current one
      const nextFile = historyTabs[1]; // at this point the props has not been updated.
      const nextTab = _.find(openTabs, { file: nextFile });
      history.push(`/element/${encodeURIComponent(nextTab.file)}/${nextTab.tab}`);
    }
  }

  render() {
    const { openTabs } = this.props.home;
    const file = decodeURIComponent(this.props.match.params.file);
    const iconTypeMap = {
      component: 'appstore-o',
      action: 'notification',
    };
    return (
      <div className="home-element-tabs">
        {openTabs.map(tab => (
          <span
            key={tab.file}
            onClick={() => this.handleTabClick(tab)}
            className={classnames('tab', { 'tab-active': tab.file === file })}
          >
            <Icon type={iconTypeMap[tab.type] || 'file'} />
            <label title={`${tab.feature}/${tab.name}`}>{tab.name}</label>
            <Icon type="close" onClick={(evt) => this.handleClose(evt, tab)} />
          </span>
        ))}       
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
    actions: bindActionCreators({ openTab, closeTab }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElementTabs);
