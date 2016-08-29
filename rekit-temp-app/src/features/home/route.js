import {
  DefaultPage,
  TestPage1,
  TestPage2,
  MyPage,
} from './index';

export default {
  path: '',
  name: 'home',
  siteIndexRoute: { component: DefaultPage },
  childRoutes: [
    { path: 'test-page-1', component: TestPage1 },
    { path: 'test-page-2', component: TestPage2 },
    { path: 'my-page', component: MyPage },
  ],
};
