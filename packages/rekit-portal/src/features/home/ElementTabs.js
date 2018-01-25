import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import classnames from 'classnames';
import history from '../../common/history';
import { closeTab } from './redux/actions';
import editorStateMap from './editorStateMap';

export class ElementTabs extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

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

  handleTabClick = (file) => {
    const tab = _.find(this.props.home.openTabs, { file });
    const path = `/element/${encodeURIComponent(file)}/${tab.tab}`;
    if (document.location.pathname !== path) {
      // this.props.actions.openTab(tab.file, tab.tab);
      history.push(path);
    }
  }

  handleClose = (evt, tab) => {
    evt.stopPropagation();
    this.props.actions.closeTab(tab.file);
    const { openTabs, historyTabs, cssExt } = this.props.home;
    const ele = this.getElementData(tab.file);
    if (ele) {
      const codeFile = ele.file;
      const styleFile = `src/features/${ele.feature}/${ele.name}.${cssExt}`;
      const testFile = `tests/${ele.file.replace(/^src\//, '').replace('.js', '')}.test.js`;

      delete editorStateMap[codeFile];
      delete editorStateMap[styleFile];
      delete editorStateMap[testFile];
    }

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
            onClick={() => this.handleTabClick(tab.file)}
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
    actions: bindActionCreators({ closeTab }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElementTabs);
