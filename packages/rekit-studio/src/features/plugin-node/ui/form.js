import React from 'react';
import _ from 'lodash';
import { Input, Checkbox, Select } from 'antd';
import store from '../../../common/store';

const Option = Select.Option;

const createSelectOptions = options => options.map(opt => <Option key={opt.value || opt.name}>{opt.name}</Option>);

const byId = id => store.getState().home.elementById[id];
const parentElement = id => byId(byId(id).parent);

const getLayouts = () =>{
  const layouts = byId('v:layouts')
    .children.map(byId)
    .filter(ele => ele.type === 'layout')
    .map(f => ({ name: f.name, value: f.name }));
  layouts.push({
    name: 'no layout',
    value: '_no_layout',
  });
  return layouts;
}

// const getInitialLayout = args => {
//   const { context } = args;
//   if (context && context.targetId && byId(context.targetId)) {
//     const targetEle = byId(context.targetId);

//     if (targetEle.type === 'feature') {
//       return targetEle.name;
//     }
//     if (/^actions|components$/.test(targetEle.type)) {
//       return parentElement(targetEle.id).name;
//     }
//     if (/^action|component$/.test(targetEle.type)) {
//       return parentElement(parentElement(targetEle.id).id).name;
//     }
//   }

//   return '';
// };

const layoutMeta = args => ({
  key: 'layout',
  label: 'Layout',
  widget: Select,
  required: true,
  children: createSelectOptions(getLayouts()),
  initialValue: getLayouts()[0].value,
});

const nameMeta = () => ({
  key: 'name',
  label: 'Name',
  widget: Input,
  autoFocus: true,
  required: true,
});

export default {
  fillMeta(args) {
    switch (args.formId) {
      case 'core.element.add.page':
        args.meta.elements.push(
          layoutMeta(args),
          nameMeta(args),
          {
            key: 'urlPath',
            label: 'Url Path',
            widget: Input,
            required: true,
            tooltip: 'The URL path to access the page.',
          },
          {
            key: 'locale',
            label: 'Locale',
            widget: Checkbox,
            initialValue: false,
            tooltip: 'Whether to create a locale file for the page.',
          },
        );

        break;
      case 'core.element.add.uiModule':
      case 'core.element.add.layout':
        args.meta.elements.push(
          nameMeta(args),
        );
        break;
      case 'core.element.add.service':
        args.meta.elements.push(
          nameMeta(args),
          {
            key: 'urlPath',
            label: 'Url Path',
            widget: Input,
            tooltip: 'The URL path to access the service.',
          },
        );
        break;
      default:
        break;
    }
  },
  processValues(cmd) {
    const { formId } = cmd;
    switch (formId) {
      default:
        break;
    }
    return cmd;
  },
};
