import { Modal, message } from 'antd';
import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

const showDialog = (...args) => store.dispatch(actions.showDialog(...args));
const execCoreCommand = args => store.dispatch(actions.execCoreCommand(args));

const byId = id => store.getState().home.elementById[id];

const menuItems = {
  del: { name: 'Delete', key: 'del-file-folder' },
  move: { name: 'Move', key: 'move' },
  rename: { name: 'Rename', key: 'rename' },
  newFile: { name: 'New File', key: 'new-file' },
  newFolder: { name: 'New Folder', key: 'new-folder' },
};

export default {
  contextMenu: {
    fillMenuItems(items, { elementId }) {
      const ele = byId(elementId);
      if (!ele) return;
      switch (ele.type) {
        case 'folder':
          items.push(menuItems.newFile, menuItems.newFolder, menuItems.rename, menuItems.del);
          break;
        case 'misc':
          items.push(menuItems.newFile, menuItems.newFolder);
          break;
        case 'file':
          items.push(menuItems.rename, menuItems.del);
          break;
        default:
          break;
      }
    },
    handleMenuClick({ elementId, key }) {
      switch (key) {
        case 'new-file': {
          showDialog('core.element.add.file', 'New File', {
            action: 'add',
            targetId: elementId,
          });
          break;
        }
        case 'new-folder': {
          showDialog('core.element.add.folder', 'New Folder', {
            action: 'add',
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
        case 'del-file-folder': {
          const ele = byId(elementId);
          
          Modal.confirm({
            title: `Are you sure to delete the ${ele.type}?`,
            onOk() {
              if (!ele) {
                Modal.error({
                  title: 'No element to delete',
                  content: `Element not found: ${elementId}`,
                });
                return;
              }
              const name = ele.id;
              execCoreCommand({
                commandName: 'remove',
                type: ele.type,
                name,
              }).then(
                () => {
                  message.success(`Delete ${ele.type} success.`);
                },
                err => {
                  Modal.error({
                    title: `Failed to delete the ${ele.type}`,
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
