import store from '../../../common/store';

export default {
  badges: [
    { type: 'route', name: 'Routes', count: () => store.getState().home.routes.length },
    { type: 'page', name: 'Pages' },
    { type: 'ui-module', name: 'UI Modules' },
    { type: 'layout', name: 'Layouts' },
    { type: 'service', name: 'Services' },
  ],
};
