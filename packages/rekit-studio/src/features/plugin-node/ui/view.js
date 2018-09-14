import { RoutesView } from '../';

export default {
  getView(element, view) {
    if (element.type === 'routes' && view === 'rules') {
      return RoutesView;
    }

    return null;
  },
};
