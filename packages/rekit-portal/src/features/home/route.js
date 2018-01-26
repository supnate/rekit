import {
  ElementPage,
  RoutesPage,
  HomePage,
  BlankPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { name: 'Home page', component: HomePage, isIndex: true },
    // { path: '/element', name: 'Element page', component: ElementPage },
    // { path: '/element/:type', name: 'Element page', component: ElementPage },
    { path: '/blank', name: 'Blank page', component: BlankPage },
    { path: '/element/:file/:type?', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes/:type?', name: 'Routes page', component: RoutesPage },
  ],
};
