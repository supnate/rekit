import { RouteRulesView, ElementDiagram } from '../';

export default {
  getView(element, view) {
    if (element.type === 'routes' && view === 'rules') {
      return RouteRulesView;
    }

    return null;
  },
};
