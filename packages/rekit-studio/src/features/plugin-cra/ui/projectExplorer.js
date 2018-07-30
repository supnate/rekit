import store from '../../../common/store';
import history from '../../../common/history';

export default {
  handleSelect(elementId) {
    const { elementById } = store.getState().home.projectData;
    const ele = elementById[elementId];
    switch (ele.type) {
      case 'component':
      case 'action':
      case 'initial-state':
        history.push(`/element/${encodeURIComponent(ele.id)}`);
        break;
      default:
        break;
    }
  }
};
