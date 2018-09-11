import { Modal, message } from 'antd';
import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

const showDialog = (...args) => store.dispatch(actions.showDialog(...args));
const execCoreCommand = args => store.dispatch(actions.execCoreCommand(args));

const byId = id => store.getState().home.elementById[id];

const menuItems = {
  addPage: { name: 'Add Page', key: 'add-page' },
  addUiModule: { name: 'Add Component', key: 'add-ui-module' },
  addLayout: { name: 'Add Layout', key: 'add-layout' },
  addService: { name: 'Add Service', key: 'add-service' },
  del: { name: 'Delete', key: 'del-element' },
  move: { name: 'Move', key: 'move-element' },
  rename: { name: 'Rename', key: 'rename-element' },
};

export default {
  contextMenu: {
    fillMenuItems(items, { elementId }) {
      const ele = byId(elementId);
      if (!ele) return;
      switch (ele.type) {
        case 'pages':
          items.push(menuItems.addPage);
          break;
        case 'page':
          items.push(menuItems.rename, menuItems.del);
          break;
        case 'ui-modules':
          items.push(menuItems.addUiModule);
          break;
        case 'ui-module':
          items.push(menuItems.rename, menuItems.del);
          break;
        case 'layouts':
          items.push(menuItems.addLayout);
          break;
        case 'layout':
          items.push(menuItems.rename, menuItems.del);
          break;
        case 'services':
          items.push(menuItems.addService);
          break;
        case 'service':
          items.push(menuItems.rename, menuItems.del);
          break;
        default:
          break;
      }
    },
    handleMenuClick({ elementId, key }) {
      const ele = byId(elementId);
      switch (key) {
        case 'add-page': {
          showDialog('core.element.add.page', 'Add Page', {
            action: 'add',
            targetId: elementId,
            elementType: 'page',
          });
          break;
        }
        case 'add-ui-module': {
          showDialog('core.element.add.action', 'Add Action', {
            action: 'add',
            targetId: elementId,
            elementType: 'action',
          });
          break;
        }
        case 'rename': {
          showDialog('core.element.move.component', 'Rename', {
            action: 'rename',
            targetId: elementId,
          });
          break;
        }
        case 'move': {
          showDialog('core.element.move.component', 'Move', {
            action: 'move',
            targetId: elementId,
          });
          break;
        }
        case 'del-component-action': {
          Modal.confirm({
            title: 'Are you sure to delete the element?',
            onOk() {
              const ele = byId(elementId);
              if (!ele) {
                Modal.error({
                  title: 'No element to delete',
                  content: `Element not found: ${elementId}`,
                });
                return;
              }
              const name = ele.parts[0].replace(/^src\/features\/(redux\/)?|\.jsx?$/g, '');
              execCoreCommand({
                commandName: 'remove',
                type: ele.type,
                name,
              }).then(
                () => {
                  message.success('Delete element success.');
                },
                err => {
                  Modal.error({
                    title: 'Failed to delete the element',
                    content: err.toString(),
                  });
                }
              );
            },
          });
          break;
        }
        default:
          break;
      }
    },
  },
};
