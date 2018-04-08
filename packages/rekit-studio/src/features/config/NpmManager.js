import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class NpmManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="config-npm-manager">
        Page Content: config/NpmManager
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    config: state.config,
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
)(NpmManager);
