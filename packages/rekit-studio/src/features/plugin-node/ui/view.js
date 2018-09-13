import { RoutesView, ElementDiagram } from '../';

export default {
  getView(element, view) {
    if (element.type === 'routes' && view === 'rules') {
      return RoutesView;
    }

    if (
      (['page', 'ui-module', 'layout', 'service'].includes(element.type) ||
        /^jsx?$/.test(element.ext)) &&
      view === 'diagram'
    ) {
      return ElementDiagram;
    }

    return null;
  },
};
