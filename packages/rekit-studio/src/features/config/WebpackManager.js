import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class WebpackManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="config-webpack-manager">
        Page Content: config/WebpackManager
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
)(WebpackManager);
