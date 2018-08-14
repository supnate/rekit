import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Modal } from 'antd';
import { FormBuilder } from '../common';
import { execCoreCommand } from './redux/actions';
import plugin from '../../common/plugin';

export class CommonForm extends Component {
  static propTypes = {
    // dialog: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    formId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    context: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    disabled: false,
    onCancel() {},
  };

  state = {
    pending: false,
    error: null,
  };

  getMeta() {
    const meta = {
      colon: true,
      columns: 1,
      disabled: this.state.pending,
      elements: [],
    };
    plugin.getPlugins('form.fillMeta').forEach(p =>
      p.form.fillMeta({
        context: this.props.context,
        formId: this.props.formId,
        meta,
        values: this.props.form.getFieldsValue(),
      })
    );

    return meta;
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const { context, formId } = this.props;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      console.log('Form submit: ', values);

      let command = { commandName: context.action, context, formId, values };
      plugin.getPlugins('form.processValues').forEach(p => {
        command = p.form.processValues(command);
      });

      this.setState({ pending: true });
      // if (/^add|move|update$/.test(context.action)) {
      this.props.actions
        .execCoreCommand(command)
        .then(() => {
          this.props.onSubmit();
          this.setState({ pending: false });
          // Show notification
          //
        })
        .catch(err => {
          // Show error
          this.setState({ pending: false });
          Modal.error({
            title: 'Failed',
            content: <span style={{ color: 'red' }}>{err.toString ? err.toString() : 'Unknown error.'}</span>,
          });
        });
      // } else {
      //   Modal.error({
      //     title: 'Error',
      //     content: <span style={{ color: 'red' }}>Unknown form action: {context.action}</span>,
      //   });
      //   this.setState({ pending: false });
      // }
    });
  };

  render() {
    const { pending } = this.state;
    return (
      <div className="core-common-form">
        <Form onSubmit={this.handleSubmit}>
          <FormBuilder meta={this.getMeta()} form={this.props.form} />
          <div className="form-footer">
            <Button onClick={this.props.onCancel} disabled={pending}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={pending}>
              {pending ? 'Loading...' : 'Ok'}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    dialog: state.dialog,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ execCoreCommand }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(CommonForm));
