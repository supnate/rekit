import {
  DefaultPage,
} from './index';

export default {
  path: 'common',
  name: 'Common',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage },
  ],
};
