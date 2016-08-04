import App from '../containers/App';

import { Page404 } from '../components';
import homeRoute from '../features/home/route';

export default [{
  path: '/',
  component: App,
  indexRoute: homeRoute.siteIndexRoute,
  childRoutes: [
    homeRoute,
    { path: '*', name: '404', component: Page404 },
  ],
}];
