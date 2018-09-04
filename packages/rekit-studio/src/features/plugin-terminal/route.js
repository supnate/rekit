// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  DefaultPage,
  WebTerminal,
} from './';

export default {
  path: 'plugin-terminal',
  name: 'Plugin terminal',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'terminal', name: 'Web terminal', component: WebTerminal },
  ],
};
