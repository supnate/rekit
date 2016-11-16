import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class ${_.pascalCase(component)} extends Component {
  static propTypes = {
    ${_.camelCase(feature)}: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="${_.kebabCase(feature)}-${_.kebabCase(component)}">
        Page Content: ${_.kebabCase(feature)}/${_.pascalCase(component)}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ${_.camelCase(feature)}: state.${_.camelCase(feature)},
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
)(${_.pascalCase(component)});
