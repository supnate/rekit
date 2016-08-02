import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

class ${PAGE_NAME} extends Component {
  static propTypes = {
    ${CAMEL_FEATURE_NAME}: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="${KEBAB_FEATURE_NAME}-${KEBAB_PAGE_NAME}">
        Page Content: ${PAGE_NAME}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ${CAMEL_FEATURE_NAME}: state.${CAMEL_FEATURE_NAME},
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
)(${PAGE_NAME});
