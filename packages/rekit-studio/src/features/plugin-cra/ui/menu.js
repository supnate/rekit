import { Modal, message } from 'antd';
import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

const showDialog = (...args) => store.dispatch(actions.showDialog(...args));
const execCoreCommand = args => store.dispatch(actions.execCoreCommand(args));

const byId = id => store.getState().home.elementById[id];

const menuItems = {
  addAction: { name: 'Add Action', key: 'add-action' },
  addComponent: { name: 'Add Component', key: 'add-component' },
  addFeature: { name: 'Add Feature', key: 'add-feature' },
  del: { name: 'Delete', key: 'del-component-action' },
  move: { name: 'Move', key: 'move-component-action' },
  rename: { name: 'Rename', key: 'rename-component-action' },
  showTest: { name: 'Unit Test', key: 'show-test' },
  runTest: { name: 'Run Test', key: 'run-test' },
  runTests: { name: 'Run Tests', key: 'run-tests' },
  showStyle: { name: 'Style', key: 'show-style' },
  newFile: { name: 'New File', key: 'new-file' },
  newFolder: { name: 'New Folder', key: 'new-folder' },
};

export default {
  contextMenu: {
    fillMenuItems(items, { elementId }) {
      const ele = byId(elementId);
      if (!ele) return;
      switch (ele.type) {
        case 'features':
          items.push(menuItems.addFeature);
          break;
        case 'feature':
          items.push(menuItems.addComponent, menuItems.addAction, menuItems.rename, menuItems.del);
          break;
        case 'components':
          items.push(menuItems.addComponent);
          break;
        case 'component':
          items.push(menuItems.rename, menuItems.move, menuItems.runTest, menuItems.del);
          break;
        case 'actions':
          items.push(menuItems.addAction);
          break;
        case 'action':
          items.push(menuItems.rename, menuItems.move, menuItems.runTest, menuItems.del);
          break;
        default:
          break;
      }
    },
    handleMenuClick({ elementId, key }) {
      const ele = byId(elementId);
      switch (key) {
        case 'add-component': {
          showDialog('core.element.add.component', 'Add Component', {
            action: 'add',
            targetId: elementId,
            elementType: 'component',
          });
          break;
        }
        case 'add-action': {
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
