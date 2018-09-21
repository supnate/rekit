import _ from 'lodash';
import store from '../../../common/store';

const getRoutesCount = _.memoize(eleById => {
  const routes = Object.values(eleById).filter(t => t.type === 'routes');
  return routes.reduce((count, route) => count + route.routes.length, 0);
});

export default {
  badges: [
    { type: 'feature', name: 'Features' },
    {
      type: 'route',
      name: 'Routes',
      count: () => getRoutesCount(store.getState().home.elementById),
    },
    { type: 'component', name: 'Components' },
    { type: 'action', name: 'Acttions' },
  ],
};
