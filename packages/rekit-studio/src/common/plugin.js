import _ from 'lodash';
import * as defaultPlugin from '../features/default-plugin/ui';
import * as cra from '../features/plugin-cra/ui';
import * as terminal from '../features/plugin-terminal/ui';

export default {
  plugins: [defaultPlugin, cra, terminal],
  getPlugins(prop) {
    if (!prop) return this.plugins;
    return this.plugins.filter(_.property(prop));
  }
};
