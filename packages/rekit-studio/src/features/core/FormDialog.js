import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { showDialog, hideDialog } from './redux/actions';
import { CommonForm } from './';

// Main UI wrapper for rekit-core APIs for managing project elements.
export class FormDialog extends Component {
  static propTypes = {
    dialog: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleFormSubmit = () => {};

  render() {
    const { hideDialog } = this.props.actions;
    return (
      <Modal
        visible={this.props.dialog.visible}
        title={this.props.dialog.title || 'Dialog'}
        destroyOnClose
        onCancel={hideDialog}
        footer={null}
      >
        <CommonForm
          formId={this.props.dialog.formId}
          onSubmit={hideDialog}
          context={this.props.dialog.context}
          onCancel={this.props.actions.hideDialog}
        />
      </Modal>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    core: state.core,
    dialog: state.core.dialog,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ showDialog, hideDialog }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormDialog);
