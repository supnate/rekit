import {
  DefaultPage,
  TestPage1,
} from './index';

export default {
  path: '',
  name: 'home',
  childRoutes: [
    { path: 'default-page', component: DefaultPage, isIndex: true },
    { path: 'test-page-1', component: TestPage1 },
  ],
};
