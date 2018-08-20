import { RouteRulesView, ElementDiagram } from '../';

export default {
  getView(element, view) {
    if (element.type === 'routes' && view === 'rules') {
      return RouteRulesView;
    }

    if ((['component', 'action'].includes(element.type) || /^jsx?$/.test(element.ext)) && view === 'diagram') {
      return ElementDiagram;
    }

    return null;
  },
};
