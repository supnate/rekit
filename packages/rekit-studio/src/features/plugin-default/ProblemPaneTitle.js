import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class ProblemPaneTitle extends Component {
  static propTypes = {
    problems: PropTypes.object.isRequired,
  };

  render() {
    const count = Object.values(this.props.problems)
      .filter(arr => !_.isEmpty(arr))
      .reduce((count, msgs) => count + msgs.length, 0);
    return (
      <span className="plugin-default-problem-pane-title">
        Problems <span className="problems-count">{count}</span>
      </span>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    problems: state.pluginDefault.problems,
  };
}

export default connect(mapStateToProps)(ProblemPaneTitle);
