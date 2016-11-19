import {
  TestPage1,
  P1,
} from './index';

export default {
  path: 'test-1',
  childRoutes: [
    { path: 'test-page-1', component: TestPage1 },
    { path: 'abc', component: P1 },
  ],
};
