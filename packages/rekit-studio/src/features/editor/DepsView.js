import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import history from '../../common/history';
import * as actions from './redux/actions';

export class DepsView extends Component {
  static propTypes = {
    moduleKey: PropTypes.object.isRequired,
    fileById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="editor-deps-view">
        Page Content: editor/DepsView
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    editor: state.editor,
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
)(DepsView);
