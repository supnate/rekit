import { FeatureDiagramPage } from './';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [
    { path: 'feature', name: 'Feature diagram page', component: FeatureDiagramPage },
  ],
};
