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
    { name: 'Home page', component: HomePage, role: "admin", isIndex: true },
    { path: '/welcome', name: 'Welcome page', component: WelcomePage },
    { path: '/all-routes', name: 'All Routes', component: AllRoutesPage },
    { path: '/element/:file/:type?', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes/:type?', name: 'Routes page', component: RoutesPage },
  ],
};
