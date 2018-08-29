import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { clearOutput } from './redux/actions';

export class OutputView extends Component {
  static propTypes = {
    output: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="home-output-view">
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
        <div>Page Content: home/OutputView</div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    output: state.home.output,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ clearOutput }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputView);
