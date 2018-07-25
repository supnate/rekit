import { Input, Checkbox, Select } from 'antd';
import store from '../../../common/store';

export default {
  processMeta(args) {
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
      }
    );
  },
  handleSubmit() {
    return Promise.resolve();
  },
};
