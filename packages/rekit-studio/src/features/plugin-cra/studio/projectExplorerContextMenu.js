export default {
  getMenuItems(args) {
    const { elementId, eventKey, store } = args;    
    return [];
  },
  handleMenuClick(args) {
    const { elementId, eventKey, store } = args;
    console.log('menu click: ', args);
  }
};