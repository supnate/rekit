import {
  ElementPage,
  RoutesPage,
  HomePage,
  WelcomePage,
  AllRoutesPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { name: 'Home page', component: HomePage, isIndex: true },
    // { path: '/element', name: 'Element page', component: ElementPage },
    // { path: '/element/:type', name: 'Element page', component: ElementPage },
    { path: '/welcome', name: 'Welcome page', component: WelcomePage },
    { path: '/all-routes', name: 'All Routes', component: AllRoutesPage },
    { path: '/element/:file/:type?', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes/:type?', name: 'Routes page', component: RoutesPage },
  ],
};
