import {
  TestCoveragePage,
  BuildPage,
  RunTestPage,
} from './index';

export default {
  path: 'tools',
  name: 'Rekit tools',
  childRoutes: [
    { path: 'coverage', name: 'Test coverage page', component: TestCoveragePage },
    { path: 'build', name: 'Build page', component: BuildPage },
    { path: 'tests/:testFile?', name: 'Run test page', component: RunTestPage },
  ],
};
