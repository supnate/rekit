import _ from 'lodash';
import store from '../../common/store';

// store.subscribe(() => {
//   console.log(store.getState().home);
// });

// function select(state) {
//   return state.auth.tokens.authentication_token
// }

// function listener

const baseMeta = {
  feature: { label: 'Feature', key: 'feature', type: 'string', widget: 'feature', required: true },
  name: {
    label: 'Name',
    key: 'name',
    type: 'string',
    widget: 'textbox',
    required: true,
  },
  checkbox: { type: 'bool', widget: 'checkbox' },
  textbox: { type: 'string', widget: 'textbox' },
};

// NOTE: autoFocus only supports textbox now
const elementNameRules = [{ pattern: /^[a-zA-Z_]/, message: 'Name should start with letter or _.' }];
export function getMeta(cmdType, cmdArgs) {
  const meta = {};
  const fields = [];
  switch (cmdType) {
    case 'add-feature':
      fields.push({ ...baseMeta.name, autoFocus: true, rules: elementNameRules });
      break;
    case 'add-action':
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name, autoFocus: true, rules: elementNameRules },
        {
          ...baseMeta.checkbox,
          label: 'Async',
          key: 'async',
          tooltip: 'Whether the action is async using redux-middleware-thunk.',
        }
      );
      break;
    case 'add-component': {
      const plugins = store.getState().home.rekit.plugins;
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name, autoFocus: true, rules: elementNameRules },
        {
          ...baseMeta.checkbox,
          label: 'Connect to Store',
          key: 'connect',
          tooltip: 'Whether to connect to Redux store using react-redux',
        },
        plugins && plugins.indexOf('apollo') >= 0
          ? {
              type: 'bool',
              widget: 'checkbox',
              label: 'Use Apollo',
              tooltip: 'Whether to use Apollo client for graphql in the component.',
              key: 'apollo',
            }
          : null,
        {
          ...baseMeta.textbox,
          label: 'Url Path',
          key: 'urlPath',
          tooltip: 'If provided, will create a route rule in React Router config.',
        }
      );
      break;
    }
    case 'rename':
    case 'move':
      fields.push(
        !/feature|file|folder/.test(cmdArgs.elementType) && {
          ...baseMeta.feature,
          initialValue: cmdArgs.feature,
          key: 'targetFeature',
          label: 'Target feature',
        },
        {
          ...baseMeta.name,
          autoFocus: true,
          initialValue: cmdArgs.elementName,
          key: 'newName',
          label: 'New Name',
          rules: /action|component|feature/.test(cmdArgs.elementType) ? elementNameRules : null,
        }
      );
      break;
    case 'new-folder':
    case 'new-file':
      fields.push({ ...baseMeta.name, autoFocus: true });
      break;
    default:
      console.log('Unknown cmd type: ', cmdType);
      break;
  }

  meta.fields = _.compact(fields);

  return meta;
}

export function convertArgs(values, cmdArgs) {
  switch (cmdArgs.type) {
    case 'add-feature':
      return {
        ...values,
        commandName: 'add',
        type: 'feature',
        name: values.name,
      };
    case 'add-action':
      return {
        ...values,
        commandName: 'add',
        type: 'action',
        name: `${values.feature}/${values.name}`,
        async: values.async,
      };
    case 'add-component':
      return {
        ...values,
        commandName: 'add',
        type: 'component',
        name: `${values.feature}/${values.name}`,
        urlPath: values.urlPath || false,
        connect: values.connect || false,
      };
    case 'move':
    case 'rename':
      return {
        ...values,
        commandName: 'move',
        type: cmdArgs.elementType,
        path: cmdArgs.file || null,
        source: /feature|file|folder/.test(cmdArgs.elementType)
          ? cmdArgs.elementType === 'feature' ? cmdArgs.feature : cmdArgs.elementName
          : `${cmdArgs.feature}/${cmdArgs.elementName}`,
        target: /feature|file|folder/.test(cmdArgs.elementType)
          ? values.newName
          : `${values.targetFeature}/${values.newName}`,
      };
    case 'new-folder':
      return {
        ...values,
        commandName: 'add',
        type: 'folder',
        name: values.name,
        path: cmdArgs.file,
      };
    case 'new-file':
      return {
        ...values,
        commandName: 'add',
        type: 'file',
        name: values.name,
        path: cmdArgs.file,
      };
    default:
      console.log('Unknown cmd type: ', cmdArgs.type);
      break;
  }
  return null;
}
