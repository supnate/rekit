import {
  DefaultPage,
  TestPage1,
} from './index';

export default {
  path: '',
  name: 'home',
  siteIndexRoute: { component: DefaultPage },
  childRoutes: [
    { path: 'test-page-1', component: TestPage1 },
  ],
};
