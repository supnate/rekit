import {
  // DefaultPage,
  // TestPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: 'default-page',
      name: 'Default page',
      // component: DefaultPage,
      getComponent(loc, cb) {
        console.log('lazy load default page');
        import('./DefaultPage').then(m => cb(null, m.default));
      },
      isIndex: true,
    },
    // { path: 'test-page', name: 'Test page', component: TestPage },
  ],
};
