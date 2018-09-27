import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Badge } from 'antd';
import { SvgIcon } from '../common';
import element from '../../common/element';
import editorStateMap from '../editor/editorStateMap';
import { stickTab } from '../home/redux/actions';

export class ProblemsView extends Component {
  static propTypes = {
    problems: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    closedFiles: {},
  };

  toggleCollapse = file => {
    this.setState({
      closedFiles: {
        ...this.state.closedFiles,
        [file]: !this.state.closedFiles[file],
      },
    });
  };

  handleMsgClick(file, msg) {
    _.merge(editorStateMap, {
      [file]: {
        viewState: {
          firstPosition: {
            column: msg.column,
            lineNumber: msg.line,
          },
        },
        cursorState: [
          {
            inSelectionMode: true,
            position: {
              column: msg.endColumn || msg.column,
              lineNumber: msg.endLine || msg.line,
            },
            selectionStart: {
              column: msg.column,
              lineNumber: msg.line,
            },
          },
        ],
      },
    });
    const res = element.show(file);
    if (!res) window.GLOBAL_EDITOR.restoreViewState(editorStateMap[file] || null);
  }
  handleMsgDblClick() {
    setTimeout(() => this.props.actions.stickTab(), 100);
  }

  renderErrorIcon(msg) {
    let type, color;
    if (msg.severity === 1) {
      type = 'warning';
      color = '#FFC107';
    } else {
      type = 'error';
      color = '#ef5350';
    }
    return <SvgIcon type={type} size={11} fill={color} />;
  }

  renderFileProblem(file, msgs) {
    const byId = id => this.props.elementById[id];
    let ele = byId(file);
    if (!ele) return null; // File may be deleted
    if (ele.owner) ele = byId(ele.owner);
    if (ele.target) ele = byId(ele.target);

    const isClosed = this.state.closedFiles[file];

    return (
      <dl key={file} className={isClosed ? 'file-closed' : ''}>
        <dt onClick={() => this.toggleCollapse(file)}>
          <SvgIcon
            type={isClosed ? 'anticon-caret-right' : 'anticon-caret-down'}
            size={8}
            fill="#aaa"
            className="error-switcher"
          />
          <SvgIcon type={ele.icon} size={12} fill={ele.iconColor} />
          {ele.name} <span className="full-path">{file}</span>
          <Badge count={msgs.length} />
        </dt>
        {msgs.map(msg => (
          <dd
            key={`${msg.ruleId}-${msg.line}-${msg.column}`}
            onClick={() => this.handleMsgClick(file, msg)}
            onDoubleClick={() => this.handleMsgDblClick(file, msg)}
          >
            {this.renderErrorIcon(msg)}
            <span className="problem-source">[eslint]</span>
            <span className="problem-message" title={msg.message}>
              {msg.message} ({msg.ruleId})
            </span>
            <span className="source-pos">
              ({msg.line}, {msg.column})
            </span>
          </dd>
        ))}
      </dl>
    );
  }

  render() {
    const { problems } = this.props;
    return (
      <div className="plugin-default-problems-view">
        {Object.keys(problems)
          .filter(k => !_.isEmpty(problems[k]))
          .map(k => this.renderFileProblem(k, problems[k]))}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    problems: state.pluginDefault.problems,
    elementById: state.home.elementById,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ stickTab }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsView);
