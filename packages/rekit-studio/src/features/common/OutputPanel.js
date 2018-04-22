import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Convert from 'ansi-to-html';
import { Icon } from 'antd';
import * as actions from './redux/actions';

const convert = new Convert();

export class OutputPanel extends Component {
  static propTypes = {
    common: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    style: PropTypes.object,
    filter: PropTypes.array.isRequired, // filter output
    onClose: PropTypes.func,
  };

  static defaultProps = { style: {}, onClose() {} };

  render() {
    const output = this.props.filter.reduce(
      (prev, name) => [...prev, ...(this.props.common.cmdOutput[name] || [])],
      []
    );
    return (
      <div className="common-output-panel" style={this.props.style}>
        <Icon type="close" onClick={this.props.onClose} title="Close" />
        {output
          .map(text => text.replace('[1G', ''))
          .map(text => <div dangerouslySetInnerHTML={{ __html: convert.toHtml(text) }} />)}
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
