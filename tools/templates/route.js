import {
} from './index';

export default {
  path: '${_.kebabCase(feature)}',
  name: '${_.upperFirst(_.lowerCase(feature))}',
  childRoutes: [
  ],
};
