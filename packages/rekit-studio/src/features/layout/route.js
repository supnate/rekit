import { PanelSample } from './';
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html


export default {
  path: 'layout',
  name: 'Layout',
  childRoutes: [
    { path: 'sample', name: 'Panel sample', component: PanelSample },

  ],
};
