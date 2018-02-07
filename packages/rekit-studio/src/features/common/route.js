import { MonacoEditorTest } from './';

export default {
  path: 'common',
  name: 'Common',
  childRoutes: [
    { path: 'monaco-editor', name: 'Monaco editor test', component: MonacoEditorTest },
  ],
};
