import App from '../containers/App';

import { PageNotFound } from '../components';
import homeRoute from '../features/home/route';
import test1Route from '../features/test-1/route';
import test2Route from '../features/test-2/route';

export default [{
  path: '/',
  component: App,
  indexRoute: homeRoute.siteIndexRoute,
  childRoutes: [
    homeRoute,
    test1Route,
    test2Route,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ],
}];
