import App from '../containers/App';

import homeRoute from '../features/home/route';

export default [{
  path: '/',
  component: App,
  indexRoute: homeRoute.siteIndexRoute,
  childRoutes: [
    homeRoute,
  ]
}];
