import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Convert from 'ansi-to-html';
import * as actions from './redux/actions';

const convert = new Convert();

export class OutputPanel extends Component {
  static propTypes = {
    common: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired, // filter output
  };

  render() {
    const output = this.props.common.cmdOutput[this.props.filter] || [];
    return (
      <div className="common-output-panel">
        {output.map(text => text.replace('[1G', '')).map(text => <div dangerouslySetInnerHTML={{ __html: convert.toHtml(text) }} />)}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    common: state.common,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OutputPanel);
