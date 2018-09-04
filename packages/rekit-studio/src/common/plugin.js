import _ from 'lodash';
import * as defaultPlugin from '../features/default-plugin/ui';
import * as cra from '../features/plugin-cra/ui';

export default {
  plugins: [defaultPlugin, cra],
  getPlugins(prop) {
    if (!prop) return this.plugins;
    return this.plugins.filter(_.property(prop));
  }
};
