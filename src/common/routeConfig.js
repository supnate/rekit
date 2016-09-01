import App from '../containers/App';

import { PageNotFound } from '../components';
import homeRoute from '../features/home/route';

export default [{
  path: '/',
  component: App,
  indexRoute: homeRoute.siteIndexRoute,
  childRoutes: [
    homeRoute,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ],
}];
