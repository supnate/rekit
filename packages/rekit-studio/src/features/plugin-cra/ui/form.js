import { Input, Checkbox, Select } from 'antd';
import store from '../../../common/store';

export default {
  processMeta(args) {
    console.log('process meta: ', args);
    switch (args.formId) {
      case 'core.element.add.component':
        args.meta.elements.push(
          {
            key: 'feature',
            label: 'Feature',
            widget: Select,
          },
          {
            key: 'name',
            label: 'Name',
            widget: Input,
            required: true,
          },
          {
            key: 'connected',
            label: 'Connect to Store',
            widget: Checkbox,
            initialValue: false,
          },
          {
            key: 'urlPath',
            label: 'Url Path',
            widget: Input,
          }
        );

        break;
      case 'core.element.add.action':
        args.meta.elements.push(
          {
            key: 'feature',
            label: 'Feature',
            widget: Select,
          },
          {
            key: 'name',
            label: 'Name',
            widget: Input,
            required: true,
          },
          {
            key: 'async',
            label: 'Async',
            widget: Checkbox,
            initialValue: false,
          },
        );

        break;
      default:
        break;
    }
  },
  handleSubmit() {
    return Promise.resolve();
  },
};
