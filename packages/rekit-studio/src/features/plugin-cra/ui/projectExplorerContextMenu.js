import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

export default {
  getMenuItems(args) {
    const { elementId, eventKey } = args;    
    return [{ name: 'Add Action', key: 'add-action' }];
  },
  handleMenuClick(args) {
    const { elementId, eventKey } = args;
    console.log('menu click: ', args);
    store.dispatch(actions.showDialog('core', 'Add Action', {
      action: 'add',
      targetId: elementId,
      elementType: 'action',
    }));
  }
};
