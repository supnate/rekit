import _ from 'lodash';
import * as cra from '../features/plugin-cra/ui';

export default {
  plugins: [cra],
  getPlugins(prop) {
    if (!prop) return this.plugins;
    return this.plugins.filter(_.property(prop));
  }
};
