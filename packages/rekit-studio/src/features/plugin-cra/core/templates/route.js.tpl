// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
} from './';

export default {
  path: '${_.kebabCase(feature)}',
  childRoutes: [
  ],
};
