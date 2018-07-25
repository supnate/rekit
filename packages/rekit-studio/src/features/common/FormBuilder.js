/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Col, Form, Icon, Row, Tooltip, Input } from 'antd';

const FormItem = Form.Item;

const defaultFormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function pickProps(source, props) {
  const target = {};
  props.forEach(prop => {
    if (prop in source) target[prop] = source[prop];
  });
  return target;
}

let ID_SEED = 0;
function getId() {
  ID_SEED += 1;
  return `form_builder_id_${ID_SEED}`;
}

// class TextWidget extends Component {
//   static propTypes = {
//     value: PropTypes.any,
//   };
//   static defaultProps = {
//     value: '',
//   };
//   render() {
//     return this.props.value;
//   }
// }

class FormBuilder extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    form: PropTypes.object,
    disabled: PropTypes.bool,
    viewMode: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    form: null,
    viewMode: false,
  };

  constructor(props) {
    super(props);
    this.renderElement = this.renderElement.bind(this);
  }

  getMeta() {
    const { meta } = this.props;
    return meta.elements ? meta : { elements: [meta] };
  }

  renderElement(element) {
    const meta = this.getMeta();

    // Handle form item props
    const label = element.tooltip ? (
      <span>
        {element.label}
        <Tooltip title={element.tooltip}>
          {' '}
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    ) : (
      element.label
    );

    const formItemProps = {
      key: element.key,
      colon: meta.colon,
      ...(meta.formItemLayout || (element.label ? defaultFormItemLayout : null)),
      label,
      ...pickProps(element, [
        'help',
        'extra',
        'labelCol',
        'wrapperCol',
        'colon',
        'hasFeedback',
        'validateStatus',
        'hasFeedback',
      ]),
      ...element.formItemProps,
    };

    if (element.colSpan) {
      const labelCol = formItemProps.labelCol.span / element.colSpan;

      Object.assign(formItemProps, {
        labelCol: { span: labelCol },
        wrapperCol: { span: 24 - labelCol },
      });
    }

    if (element.render) {
      return element.render.call(this, { formItemProps, element, disabled: this.props.disabled });
    }

    // Handle field props
    const rules = [...(element.rules || [])];
    if (element.required) {
      rules.push({
        required: true,
        message: `${element.label || element.key} is required.`, // default to English, if needs localization, pass message to it.
      });
    }
    const fieldProps = {
      ...pickProps(element, [
        'getValueFromEvent',
        'initialValue',
        'normalize',
        'trigger',
        'valuePropName',
        'validateTrigger',
        'validateFirst',
      ]),
      rules,
      ...element.fieldProps,
    };

    // Handle widget props
    const wp = element.widgetProps || {};
    const widgetProps = {
      ...pickProps(element, ['placeholder', 'type', 'className', 'class']),
      ...wp,
      disabled: element.disabled || wp.disabled || this.props.disabled,
      readOnly: element.readonly || wp.readonly || this.props.readonly,
    };

    if (!element.id) {
      // widgetProps.id = formItemProps.id = getId();
    }

    const { getFieldDecorator } = this.props.form;
    const ElementWidget = element.widget || Input;
    if (this.props.viewMode) {
      return (
        <FormItem {...formItemProps}>
          <span title={element.initialValue}>
            {element.renderView ? element.renderView(element) : element.initialValue || ''}
          </span>
        </FormItem>
      );
    }
    return (
      <FormItem {...formItemProps}>
        {getFieldDecorator(element.id || element.key, fieldProps)(
          <ElementWidget {...widgetProps}>{element.children || null}</ElementWidget>,
        )}
      </FormItem>
    );
  }

  renderLayout(elements, rawElements) {
    // Layout the form in columns
    const columns = this.props.meta.columns || 1;
    if (columns === 1) return elements;
    const gutter = this.props.meta.gutter || 0;
    const rows = [];
    const colspan = 24 / columns;
    for (let i = 0; i < elements.length; ) {
      const cols = [];
      const eleSpan = rawElements[i].colSpan || 1;
      for (let j = 0; j < columns; j += eleSpan) {
        cols.push(
          <Col key={j} span={(colspan * eleSpan).toString()}>
            {elements[i]}
          </Col>,
        );
        i += 1;
      }
      rows.push(
        <Row
          key={i}
          gutter={gutter}
          className={`form-builder-row ${this.props.viewMode ? 'form-builder-row-view-mode' : ''}`}
        >
          {cols}
        </Row>,
      );
    }
    return rows;
  }

  render() {
    return this.renderLayout(
      this.getMeta().elements.map(this.renderElement),
      this.getMeta().elements,
    );
  }
}

export default FormBuilder;
