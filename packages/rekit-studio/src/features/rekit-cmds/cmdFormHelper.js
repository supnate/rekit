import _ from 'lodash';

const baseMeta = {
  feature: { label: 'Feature', key: 'feature', type: 'string', widget: 'feature', required: true },
  name: { label: 'Name', key: 'name', type: 'string', widget: 'textbox', required: true },
  checkbox: { type: 'bool', widget: 'checkbox' },
  textbox: { type: 'string', widget: 'textbox' },
};

// NOTE: autoFocus only supports textbox now
export function getMeta(cmdType, cmdArgs) {
  const meta = {};
  const fields = [];
  switch (cmdType) {
    case 'add-feature':
      fields.push({ ...baseMeta.name, autoFocus: true });
      break;
    case 'add-action':
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name, autoFocus: true },
        {
          ...baseMeta.checkbox,
          label: 'Async',
          key: 'async',
          tooltip: 'Whether the action is async using redux-middleware-thunk.',
        }
      );
      break;
    case 'add-component':
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name, autoFocus: true },
        {
          ...baseMeta.checkbox,
          label: 'Connect to store',
          key: 'connect',
          tooltip: 'Whether to connect to Redux store using react-redux',
        },
        {
          ...baseMeta.textbox,
          label: 'Url path',
          key: 'urlPath',
          tooltip: 'If provided, will create a route rule in React Router config.',
        }
      );
      break;
    case 'rename':
    case 'move':
      fields.push(
        !/feature|file|folder/.test(cmdArgs.elementType) && {
          ...baseMeta.feature,
          initialValue: cmdArgs.feature,
          key: 'targetFeature',
          label: 'Target feature',
        },
        { ...baseMeta.name, autoFocus: true, initialValue: cmdArgs.elementName, key: 'newName', label: 'New name' }
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
        commandName: 'add',
        type: 'feature',
        name: values.name,
      };
    case 'add-action':
      return {
        commandName: 'add',
        type: 'action',
        name: `${values.feature}/${values.name}`,
        async: values.async,
      };
    case 'add-component':
      return {
        commandName: 'add',
        type: 'component',
        name: `${values.feature}/${values.name}`,
        urlPath: values.urlPath || false,
        connect: values.connect || false,
      };
    case 'move':
    case 'rename':
      return {
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
        commandName: 'add',
        type: 'folder',
        name: values.name,
        path: cmdArgs.file,
      };
    case 'new-file':
      return {
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
