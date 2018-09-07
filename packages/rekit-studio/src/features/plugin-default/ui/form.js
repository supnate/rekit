import React from 'react';
import _ from 'lodash';
import { Input, Checkbox, Select } from 'antd';
import store from '../../../common/store';

const byId = id => store.getState().home.elementById[id];
const nameMeta = () => ({
  key: 'name',
  label: 'Name',
  widget: Input,
  required: true,
});

export default {
  fillMeta(args) {
    switch (args.formId) {
      case 'core.element.add.file':
        args.meta.elements.push(
          nameMeta(),
        );
        break;
      default:
        break;
    }
  },
  preSubmit(args) {
    return Promise.resolve();
  },
  processValues(args) {
    const { context, values, formId } = args;
    switch (formId) {
      case 'core.element.add.file':
        return {
          ...values,
          commandName: context.action,
          type: context.elementType,
          name: `${values.feature}/${values.name}`.replace(/\/+/g, '/'),
        };
      default:
        break;
    }
    return args;
  },
};
