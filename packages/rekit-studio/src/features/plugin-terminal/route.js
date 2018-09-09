// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  WebTerminal,
} from './';

export default {
  path: 'plugin-terminal',
  name: 'Plugin terminal',
  childRoutes: [
    { path: 'terminal', name: 'Web terminal', component: WebTerminal },
  ],
};
