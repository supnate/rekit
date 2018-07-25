import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Modal } from 'antd';
import { FormBuilder } from '../common';
import { addElement, moveElement } from './redux/actions';
import plugin from '../plugin/plugin';

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

  constructor(props) {
    super(props);
    this.pluginForms = plugin
      .getPlugins()
      .filter(p => p.form)
      .map(p => p.form);
  }

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

    this.pluginForms.forEach(
      f => f.processMeta && f.processMeta({ formId: this.props.formId, meta, values: this.props.form.getFieldsValue() })
    );

    return meta;
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const { context } = this.props;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      console.log('Form submit: ', values);
      this.setState({ pending: true });
      // this.props.onSubmit(values);
      if (/^add|move$/.test(context.action)) {
        this.props.actions[`${context.action}Element`]({ ...context, params: values })
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
      }
    });
  };

  render() {
    const { pending } = this.state;
    return (
      <div className="core-common-form">
        <Form onSubmit={this.handleSubmit}>
          <FormBuilder meta={this.getMeta()} form={this.props.form} />
          <div className="form-footer">
            <Button onClick={this.props.onCancel} disabled={pending}>Cancel</Button>
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
    actions: bindActionCreators({ addElement, moveElement }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(CommonForm));
