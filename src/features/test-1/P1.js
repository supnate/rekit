import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class P1 extends Component {
  static propTypes = {
    test1: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="test-1-p-1">
        Page Content: test-1/P1
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    test1: state.test1,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(P1);
