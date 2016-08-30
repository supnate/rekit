import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

export class DefaultPage extends Component {
  static propTypes = {
    test2: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="test-2-default-page">
        Page Content: test-2/DefaultPage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    test2: state.test2,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
