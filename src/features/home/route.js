import index from './index';

export default {
  path: '',
  siteIndexRoute: { component: index.Page },
  childRoutes: [
    { path: 'test-page', component: index.TestPage },
    { path: 'test-page-2', component: index.TestPage2 },
  ],
};
