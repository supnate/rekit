import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

const showDialog = (...args) => store.dispatch(actions.showDialog(...args));

export default {
  getMenuItems(args) {
    // const { elementId, eventKey } = args;
    return [{ name: 'Add Component', key: 'add-component' }, { name: 'Add Action', key: 'add-action' }];
  },
  handleMenuClick(args) {
    const { elementId, key } = args;
    console.log('menu click: ', args);
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
      default:
        break;
    }
  },
};
