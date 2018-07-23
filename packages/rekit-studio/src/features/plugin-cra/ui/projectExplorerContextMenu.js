import store from '../../../common/store';

export default {
  getMenuItems(args) {
    const { elementId, eventKey } = args;    
    return [{ name: 'Add Action2', key: 'add-action' }];
  },
  handleMenuClick(args) {
    const { elementId, eventKey } = args;
    console.log('menu click: ', args);
  }
};
